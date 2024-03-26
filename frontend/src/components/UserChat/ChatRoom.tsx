import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../firebase-config';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
// import { AuthContext } from '../../context/AuthContext';
import { Box, VStack, Input, Button } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import MessageItem from './MessageItem';
import chatBG from '../../assets/chatBG.png'


interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: Date | null;
    senderPhotoURL?: string; // Add this line
}



const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { chatId } = useParams<{ chatId: string }>();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: Message[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as {
                    senderId: string,
                    text: string,
                    createdAt: Timestamp,
                    photoUrl: string | undefined
                };
                const createdAt = data.createdAt ? data.createdAt.toDate() : null;
                return {
                    id: doc.id,
                    senderId: data.senderId,
                    text: data.text,
                    createdAt,
                    senderPhotoURL: data.photoUrl
                }; // Add senderPhotoURL to the message object
            });
            setMessages(msgs);
        });
        return unsubscribe; // This is the cleanup function to unsubscribe from the listener when the component unmounts
    }, [chatId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!chatId) return;

        // Check if currentUser and currentUser.email exist
        if (!currentUser || !currentUser.email) {
            console.error("No user email found");
            // Optionally, handle this error with user feedback
            return;
        }

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        try {
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: currentUser.email, // Use email instead of uid
                createdAt: serverTimestamp(),
                photoUrl: auth.currentUser?.photoURL
            });
            setNewMessage('');
        } catch (error) {
            // Handle your error here
            console.error("Error sending message:", error);
        }
    };





    return (
        <Box p={4} bg="white" height="94vh" width="100%">
            <VStack spacing={4} align="stretch" height='full' overflow='auto'>
                <VStack
                    spacing={4}
                    overflowY="auto"
                    height="full"
                    p={4}
                    bg="purple.50"
                    borderRadius="lg"
                    boxShadow="md"
                >

                    {messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            senderId={message.senderId}
                            text={message.text}
                            createdAt={message.createdAt}
                            currentUserId={currentUser?.email ?? ''}
                            senderPhotoURL={message.senderPhotoURL}
                        />
                    ))}

                </VStack>
                <Box as="form" onSubmit={sendMessage} display="flex" mt={3}>
                    <Input
                        flexGrow={1}
                        mr={2}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        bg="white"
                        borderColor="purple.300"
                        _hover={{ borderColor: 'purple.400' }}
                        _focus={{ borderColor: 'purple.500' }}
                    />
                    <Button type="submit" colorScheme="purple">
                        Send
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
};

export default ChatRoom;
