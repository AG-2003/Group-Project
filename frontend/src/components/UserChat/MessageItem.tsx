import React from 'react';
import { Box, HStack, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import firebase from 'firebase/compat/app'; // Ensure you have the Firebase SDK imported
import { Timestamp } from 'firebase/firestore';
import { MessageItemProps } from '../../interfaces/MessageItemProps';
import { Image } from '@chakra-ui/react'
import Linkify from 'react-linkify';
import chatBG from '../../assets/chatBG.png';


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
            src={senderPhotoURL ?? chatBG}
            alt={senderId || 'chat background'}
            mr={isCurrentUser ? 0 : 2}
            ml={isCurrentUser ? 2 : 0}
        />
    );

    const handleLinkClick = (event: any) => {
        event.preventDefault();
        const href = event.target.href;
        window.open(href, '_blank');
    };


    return (
        <Linkify>
        <HStack alignSelf={align} bg={bg} p={3} my={2} mx={1} borderRadius={borderRadius} maxWidth="40%">
            {!isCurrentUser && imageElement}
            <VStack align={isCurrentUser ? 'end' : 'start'} spacing={1}>
                <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a href={decoratedHref} key={key} onClick={handleLinkClick} target="_blank" rel="noopener noreferrer">
                        {decoratedText}
                    </a>
                )}>
                    <Text>{text}</Text>
                </Linkify>
                {/* <Text fontSize="lg" textAlign='center'>{text}</Text> */}
                {createdAt && (
                    <Text fontSize="xs" color="gray.500">
                        {formatDistanceToNow(createdAt, { addSuffix: true })}
                    </Text>
                )}
            </VStack>
            {isCurrentUser && imageElement}
        </HStack>
        </Linkify>
    );
};

export default MessageItem;
