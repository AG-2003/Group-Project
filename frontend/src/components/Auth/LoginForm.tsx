import React from 'react';
import {
    VStack,
    Button,
    Flex,
    Box,
    HStack,
    Text
} from '@chakra-ui/react';
import { FaGoogle, FaMicrosoft, FaMailBulk } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {

    let navigate = useNavigate(); // Initialize the navigate function

    // Define a function to handle the email login navigation
    const handleEmailLoginClick = () => {
        navigate('/loginEmail'); // Replace '/login/email' with the path to your EmailLogin page
    };


    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="purple.200"
        >
            <HStack spacing={0}>
                <Box h="600px" w="500px" bg="purple.100">
                    <VStack
                        spacing={12}
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                    >
                        <Text fontSize="2xl" fontWeight="bold" color="blackAlpha.800" paddingBottom={50}>
                            LOGIN / SIGNUP
                        </Text>

                        <Button
                            leftIcon={<FaGoogle />}
                            w="85%"
                            h="10%"
                            variant="outline"
                            border="solid 2px black"
                            _hover={{ bg: "purple.300", color: "black", transform: "scale(1.08)" }}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            leftIcon={<FaMicrosoft />}
                            w="85%"
                            h="10%"
                            variant="outline"
                            border="solid 2px black"
                            _hover={{ bg: "purple.300", color: "black", transform: "scale(1.08)" }}
                        >
                            Continue with Microsoft
                        </Button>
                        <Button
                            leftIcon={<FaMailBulk />}
                            w="85%"
                            h="10%"
                            variant="outline"
                            border="solid 2px black"
                            _hover={{ bg: "purple.300", color: "black", transform: "scale(1.08)" }}
                            onClick={handleEmailLoginClick} // Use the handleEmailLoginClick function here
                        >
                            Continue with Email
                        </Button>
                    </VStack>
                </Box>
                <Box h="600px" w='500px' bg="#857385">
                    {/* Other content */}
                </Box>
            </HStack>
        </Flex>
    );
}
