import React from 'react';
import { Box, HStack, Text, VStack, useColorModeValue } from '@chakra-ui/react';
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



    const date = createdAt ? createdAt : null;

    const imageElement = (
        <Image
            borderRadius='full'
            boxSize='20px'
            src={senderPhotoURL}
            alt={senderId}
            mr={isCurrentUser ? 0 : 2}
            ml={isCurrentUser ? 2 : 0}
        />
    );


    return (
        <HStack alignSelf={align} bg={bg} p={3} my={2} mx={1} borderRadius={borderRadius} maxWidth="40%">
            {!isCurrentUser && imageElement}
            <VStack align={isCurrentUser ? 'end' : 'start'} spacing={1}>
                <Text fontSize="lg" textAlign='center'>{text}</Text>
                {createdAt && (
                    <Text fontSize="xs" color="gray.500">
                        {formatDistanceToNow(createdAt, { addSuffix: true })}
                    </Text>
                )}
            </VStack>
            {isCurrentUser && imageElement}
        </HStack>
    );
};

export default MessageItem;
