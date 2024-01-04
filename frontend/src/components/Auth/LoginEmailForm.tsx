// pages/EmailLoginPage.tsx
import React, { useState } from 'react';
import {
    VStack,
    Button,
    Flex,
    Box,
    Input,
    IconButton,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config'


export function LoginEmailForm() {
    const [email, setEmail] = useState<string>('');

    const navigate = useNavigate();


    const handleEmailSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const emailExists = await checkEmailInDatabase(email);

            if (emailExists) {
                navigate('/loginPassword', { state: { email: email } });
            } else {

                navigate('/signUpEmail', { state: { email: email } });
            }
        } catch (err) {
            console.error("Error handling email submission:", err);
        }
    };


    const checkEmailInDatabase = async (email: string) => {
        const usersCollectionRef = collection(db, "users");
        try {
            const data = await getDocs(usersCollectionRef)
            const userEmails = data.docs.map((doc) => doc.data().email);
            return userEmails.some((userEmail) => userEmail === email);
        } catch (err) {
            console.log(err)
            return false;
        }
    }

    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="purple.200"
        >
            <Box h="600px" w="500px" bg="purple.100">
                <VStack
                    height="100%"
                >
                    <FormControl as="form" onSubmit={handleEmailSubmit} display="flex-start" flexDirection="column" h="100%" ml={20}>
                        <Flex alignItems="center" alignSelf="center" mb={3} mt={75}>
                            <IconButton
                                fontSize="xx-large"
                                aria-label='Back-button'
                                icon={<ArrowBackIcon />}
                                colorScheme='purple.100'
                                color="black"
                                onClick={() => navigate(-1)}
                            />
                            <FormLabel fontSize="xx-large" fontWeight="bold" color="blackAlpha.800" ml={2}>
                                Continue with Email
                            </FormLabel>
                        </Flex>

                        <FormHelperText mb={20} alignSelf="center">
                            We'll check if you have an account, and help create one <br /> if you don't.
                        </FormHelperText>

                        <Input
                            placeholder="Enter email (work or personal)"
                            h="8%"
                            w="75%"
                            type="email"
                            value={email}
                            fontSize="large"
                            onChange={(e) => setEmail(e.target.value)}
                            focusBorderColor="purple.600"
                            borderColor="black"
                            borderWidth="2px"
                            alignSelf="center"
                            _hover={{}}
                        />


                        <Button
                            isDisabled={!email}
                            h="8%"
                            w="75%"
                            mt={6}
                            fontSize="large"
                            variant="outline"
                            borderWidth="2px"
                            borderColor="black"
                            _hover={{ bg: "purple.300", color: "black", transform: "scale(1.08)" }}
                            alignSelf="center"
                            type='submit'
                        >
                            Continue
                        </Button>
                    </FormControl>
                </VStack>
            </Box>
            <Box h="600px" w='500px' bg="#857385">
                {/* Other content */}
            </Box>
        </Flex >
    );
};
