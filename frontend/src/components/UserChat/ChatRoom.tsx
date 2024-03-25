import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Box, VStack, Input, Button } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import MessageItem from './MessageItem';

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: Date | null; // Now expecting a Date object or null
}


const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { chatId } = useParams<{ chatId: string }>();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: Message[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as { senderId: string, text: string, createdAt: Timestamp };
                // Convert the Timestamp to a Date object
                const createdAt = data.createdAt ? data.createdAt.toDate() : null;
                return { id: doc.id, senderId: data.senderId, text: data.text, createdAt }; // This now matches the Message interface
            });
            setMessages(msgs); // msgs is now an array of Message objects
        });
        return unsubscribe; // This is the cleanup function to unsubscribe from the listener when the component unmounts
    }, [chatId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!chatId) return;

        // Check if currentUser and currentUser.uid exist
        if (!currentUser || !currentUser.uid) {
            console.error("No user ID found");
            // Optionally, handle this error with user feedback
            return;
        }

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        try {
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: currentUser.uid, // We've now checked that currentUser.uid is not undefined
                createdAt: serverTimestamp(),
            });
            setNewMessage('');
        } catch (error) {
            // Handle your error here
            console.error("Error sending message:", error);
        }
    };


    return (
        <Box p={4}>
            <VStack spacing={4}>
                <VStack spacing={4} overflowY="scroll" height="400px" width="100%">
                    {messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            senderId={message.senderId}
                            text={message.text}
                            createdAt={message.createdAt}
                            currentUserId={currentUser?.uid ?? ''}
                        />
                    ))}
                </VStack>
                <form onSubmit={sendMessage}>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" colorScheme="blue" mt={3}>Send</Button>
                </form>
            </VStack>
        </Box>
    );
};

export default ChatRoom;
