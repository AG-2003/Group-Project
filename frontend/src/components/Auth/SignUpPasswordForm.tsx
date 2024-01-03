import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Flex, VStack, FormControl, IconButton, FormLabel, FormHelperText, Input, Button, Box, Text, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase-config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";



export function SignUpPasswordForm() {

    const navigate = useNavigate();
    const location = useLocation();

    // const email: string = location.state?.emailS // getting the email the user entered earlier

    const email: string | null = window.localStorage.getItem('emailForSignUp');



    const [pwd, setPwd] = useState<string>('');
    const [rePwd, setRePwd] = useState<string>('');

    const [showPwd, setShowPwd] = useState(false);
    const toggleShowPwd = () => setShowPwd(!showPwd);

    const checkPwd = !(pwd === rePwd) || !pwd || !rePwd;


    // const actionCodeSettings = {
    //     // URL you want to redirect back to. The domain (www.example.com) for this
    //     // URL must be in the authorized domains list in the Firebase Console.
    //     url: 'https://localhost:3000/signUpPwd',
    //     // This must be true.
    //     handleCodeInApp: true,
    //     dynamicLinkDomain: 'localhost'
    // };



    async function handleSignUpButtonClick(e: any) {
        e.preventDefault();
        if (email === null) {
            throw new Error("Email is null - can't proceed with user creation.");
        }
        await createUserWithEmailAndPassword(auth, email, pwd)
            .then((userCredential) => {
                const user = userCredential.user;
                alert(user.email);
                console.log(user.emailVerified);

            })
            .catch((err) => {
                console.log(`this is the error code: ${err.code} and this is the message: ${err.message}`)
            })
    }




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
                    <FormControl

                        display="flex-start"
                        flexDirection="column"
                        h="100%"
                        ml={20}
                        as="form"
                        onSubmit={handleSignUpButtonClick}
                    >
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
                                Create an account
                            </FormLabel>
                        </Flex>

                        <FormHelperText cursor="default" mb={20} alignSelf="center">
                            we have sent a verification mail to <span style={{ fontWeight: 'bold' }}>{email}</span>, <br />please
                            <span style={{ fontWeight: 'bold' }}> verify</span> your email ID and proceed to setting a password.
                        </FormHelperText>

                        <InputGroup h="8%" w="75%">
                            <Input
                                id="pwd"
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

                        <InputGroup h="8%" w="75%" mt={5}>
                            <Input
                                id="checkPwd"
                                placeholder="Re-enter password"
                                type={showPwd ? "text" : "password"}
                                value={rePwd}
                                onChange={(e) => setRePwd(e.target.value)}
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
                            isDisabled={checkPwd}
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
                            Sign Up
                        </Button>

                        {/* Forgot Password text */}
                        <Text
                            w='fit-content'
                            color="black"
                            cursor="pointer"
                            // onClick={() => navigate('/forgotPwd')}
                            mt={10}
                            _hover={{ textDecoration: 'underline' }}
                        >
                            Haven't recieved email ? Resend.
                        </Text>
                    </FormControl>


                </VStack>
            </Box>
            <Box h="600px" w='500px' bg="#857385">
                {/* Other content */}
            </Box>
        </Flex >
    )
}