
import React, { useState } from 'react';
import {
    VStack,
    Button,
    Flex,
    Box,
    Text,
    Input,
    IconButton,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

export function ForgotPwdForm() {
    const [recEmail, setRecEmail] = useState<string>('');

    const navigate = useNavigate();

    const handleRecEmailSubmit = () => {
        navigate('/enterCode',);
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
                    <FormControl
                        as="form"
                        onSubmit={() => navigate('/newPwd', { state: { recEmail: recEmail } })}
                        display="flex-start"
                        flexDirection="column"
                        h="100%"
                        ml={20}>
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
                                Password retrieval
                            </FormLabel>
                        </Flex>

                        <FormHelperText mb={20} alignSelf="center">
                            Please enter your email so we can send a verification mail.
                        </FormHelperText>

                        <Input
                            placeholder="Enter email"
                            h="8%"
                            w="75%"
                            type="email"
                            value={recEmail}
                            fontSize="large"
                            onChange={(e) => setRecEmail(e.target.value)}
                            focusBorderColor="purple.600"
                            borderColor="black"
                            borderWidth="2px"
                            alignSelf="center"
                            _hover={{}}
                        />


                        <Button
                            isDisabled={!recEmail}
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
