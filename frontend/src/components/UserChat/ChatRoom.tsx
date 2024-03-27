import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../firebase-config';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, Timestamp, getDoc, doc } from 'firebase/firestore';
// import { AuthContext } from '../../context/AuthContext';
import { Box, VStack, Input, Button, Flex, Heading, Text, Image } from '@chakra-ui/react';
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
    const [otherUserName, setOtherUserName] = useState('');
    const [otherUserPhoto, setOtherUserPhoto] = useState('');
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
                };
            });
            setMessages(msgs);
        });
        return unsubscribe;
    }, [chatId]);

    useEffect(() => {
        const getOtherUserName = async () => {
            if (!chatId || !currentUser) return;

            const chatRef = doc(db, 'chats', chatId);
            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                const participants: string[] = chatSnap.data().participants;
                const otherUserEmail = participants.find(email => email !== currentUser.email);

                if (otherUserEmail) {
                    const userRef = doc(db, 'users', otherUserEmail);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        // Assuming the user document has a field 'username' that holds their username
                        const otherUserName = userSnap.data().displayName;
                        const otherUserPhotoURL = userSnap.data().photoURL;
                        setOtherUserName(otherUserName);
                        setOtherUserPhoto(otherUserPhotoURL);

                    } else {
                        console.log('No such user found!');
                    }
                } else {
                    console.log('No other user in chat!');
                }
            } else {
                console.log('No such chat found!');
            }
        };

        getOtherUserName();
    }, [currentUser, chatId]);



    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!chatId) return;


        if (!currentUser || !currentUser.email) {
            return;
        }

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        try {
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: currentUser.email,
                createdAt: serverTimestamp(),
                photoUrl: auth.currentUser?.photoURL
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };





    return (
        <Box p={4} bg="white" height="87vh" width="100%">
            <Flex

                justifyContent='flex-start'
                alignItems='center'
                p={3}
                bg="purple.200"
                // bgOpacity="0.85"
                boxShadow="md"
                borderTopRadius='lg'
            >
                <Image src={otherUserPhoto ?? chatBG} alt='photo' boxSize={10} borderRadius={50} />
                <Text fontSize="xl" fontWeight={500} color="black" ml={3}>
                    {otherUserName || 'Fetching user...'}
                </Text>
            </Flex>
            <VStack spacing={4} align="stretch" height='full' overflow='auto'>
                <VStack
                    spacing={4}
                    overflowY="auto"
                    height="100%"
                    p={4}
                    bgImage={`url(${chatBG})`}
                    bgPosition='center'
                    bgRepeat='no-repeat'
                    bgSize='cover'
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
