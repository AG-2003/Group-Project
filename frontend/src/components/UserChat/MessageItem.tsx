import React from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import firebase from 'firebase/compat/app'; // Ensure you have the Firebase SDK imported
import { Timestamp } from 'firebase/firestore';
import { MessageItemProps } from '../../interfaces/MessageItemProps';
import { Image } from '@chakra-ui/react'


const MessageItem: React.FC<MessageItemProps> = ({ text, senderId, createdAt, currentUserId, senderPhotoURL }) => {
    const isCurrentUser = senderId === currentUserId;
    // const bg = useColorModeValue(isCurrentUser ? 'blue.100' : 'yellow.50', isCurrentUser ? 'blue.900' : 'green.700');
    const align = isCurrentUser ? 'flex-end' : 'flex-start';
    const borderRadius = isCurrentUser ? '20px 0px 20px 20px' : '0px 20px 20px 20px';

    const bgCurrentUser = useColorModeValue('purple.300', 'purple.200');
    const colorCurrentUser = useColorModeValue('white', 'gray.800');

    const bgOtherUser = useColorModeValue('purple.100', 'purple.600');
    const colorOtherUser = useColorModeValue('gray.800', 'white');

    const bg = isCurrentUser ? bgCurrentUser : bgOtherUser;
    const color = isCurrentUser ? colorCurrentUser : colorOtherUser;


    // If createdAt is a Timestamp, convert it to Date, otherwise, handle as null
    const date = createdAt ? createdAt : null;


    return (
        <Box alignSelf={align} bg={bg} p={3} my={2} mx={1} borderRadius={borderRadius} maxWidth="80%">
            <HStack >
                <Text align='center' fontSize="lg">{text}</Text>
                <Image
                    borderRadius='full'
                    boxSize='20px'
                    src={senderPhotoURL}
                    alt='photo'
                />
            </HStack>

            {createdAt && (
                <Text fontSize="xs" color="gray.500">
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                </Text>
            )}
        </Box>
    );
};

export default MessageItem;
