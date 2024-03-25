import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChatSession } from '../../interfaces/ChatSession';
import { Box, Text, Button, VStack, List, ListItem, ListIcon } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

const ChatList: React.FC = () => {
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatSessions = async () => {
            if (!currentUser?.email) return;

            const chatsRef = collection(db, 'chats');
            const q = query(chatsRef, where('participants', 'array-contains', currentUser.email));
            const querySnapshot = await getDocs(q);

            const sessions: ChatSession[] = querySnapshot.docs.map((doc) => ({
                chatId: doc.id,
                ...doc.data(),
            })) as ChatSession[];

            setChatSessions(sessions);
        };

        fetchChatSessions();
    }, [currentUser?.email]);

    const handleStartChat = (chatId: string) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={4}>Your Chats</Text>
            <VStack align="stretch">
                <List spacing={3}>
                    {chatSessions.map((session) => (
                        <ListItem key={session.chatId} p={3} shadow="md" borderWidth="1px" borderRadius="md">
                            <Text>
                                Chat with: {session.participants.filter(participant => participant !== currentUser?.email).join(', ')}
                            </Text>
                            <Text fontSize="sm">
                                Last message: {session.lastMessage ?? 'No messages yet'}
                            </Text>
                            <Button leftIcon={<ChatIcon />} colorScheme="teal" variant="solid" size="sm" mt={3} onClick={() => handleStartChat(session.chatId)}>
                                Start Chat
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </VStack>
        </Box>
    );
};

export default ChatList;
