// pages/EmailLoginPage.tsx
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
    Divider,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';


export function LoginPasswordForm() {

    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email;



    const handlePwdSubmit = () => {

        if (verifyPwd) {
            navigate('/home');
        } else {
            navigate('/forgotPwd');
        }
    };

    // Placeholder for the actual implementation of password check
    const checkPwdInDatabase = (p: string) => {
        // Implement actual check here...
        return true;
    };

    const verifyPwd = checkPwdInDatabase(pwd);

    const [showPwd, setShowPwd] = React.useState(false);
    const toggleShowPwd = () => setShowPwd(!showPwd);


    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="purple.200"
        >
            <Box h="600px" w="500px" bg="purple.100" p={5}>
                <VStack
                    height="100%"
                >
                    <FormControl display="flex-start" flexDirection="column" h="100%" ml={20} as="form" onSubmit={handlePwdSubmit}>
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
                                Login to your account
                            </FormLabel>
                        </Flex>

                        <FormHelperText cursor="default" mb={20} alignSelf="center">
                            using <span style={{ fontWeight: 'bold' }}>{email}</span>
                        </FormHelperText>

                        <InputGroup h="8%" w="75%">
                            <Input
                                placeholder="Enter password"
                                type={showPwd ? "text" : "password"}
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                focusBorderColor="purple.600"
                                borderColor="black"
                                borderWidth="2px"
                                _hover={{}}
                            />
                            <InputRightElement>
                                <IconButton
                                    icon={showPwd ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={toggleShowPwd}
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                    variant="relative"
                                />
                            </InputRightElement>
                        </InputGroup>

                        <Button
                            isDisabled={!pwd || !verifyPwd}
                            h="8%"
                            w="75%"
                            mt={6}
                            fontSize="large"
                            variant="outline"
                            borderWidth="2px"
                            borderColor="black"
                            _hover={{ bg: "purple.300", color: "black", transform: "scale(1.08)" }}
                            onClick={handlePwdSubmit}
                            alignSelf="center"
                            type='submit'
                        >
                            Continue
                        </Button>

                        {/* Forgot Password text */}
                        <Text color="black" cursor="pointer" onClick={() => navigate('/forgotPwd')} mt={10} _hover={{ textDecoration: 'underline' }}>
                            Forgot Password?
                        </Text>
                    </FormControl>


                </VStack>
            </Box>
            <Box h="600px" w='500px' bg="#857385">
                {/* Other content */}
            </Box>
        </Flex >
    );
};
