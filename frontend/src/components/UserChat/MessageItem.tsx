import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import firebase from 'firebase/compat/app'; // Ensure you have the Firebase SDK imported
import { Timestamp } from 'firebase/firestore';
import { MessageItemProps } from '../../interfaces/MessageItemProps';


const MessageItem: React.FC<MessageItemProps> = ({ text, senderId, createdAt, currentUserId }) => {
    const isCurrentUser = senderId === currentUserId;
    const bg = useColorModeValue(isCurrentUser ? 'blue.50' : 'gray.50', isCurrentUser ? 'blue.900' : 'gray.700');
    const align = isCurrentUser ? 'flex-end' : 'flex-start';
    const borderRadius = isCurrentUser ? '20px 0px 20px 20px' : '0px 20px 20px 20px';

    // If createdAt is a Timestamp, convert it to Date, otherwise, handle as null
    const date = createdAt ? createdAt : null;

    return (
        <Box alignSelf={align} bg={bg} p={3} my={2} mx={1} borderRadius={borderRadius} maxWidth="80%">
            <Text fontSize="sm">{text}</Text>
            {createdAt && (
                <Text fontSize="xs" color="gray.500">
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                </Text>
            )}
        </Box>
    );
};

export default MessageItem;
