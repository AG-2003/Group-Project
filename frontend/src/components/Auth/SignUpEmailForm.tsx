import { ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, VStack, FormControl, IconButton, FormLabel, FormHelperText, Input, Button, Box } from "@chakra-ui/react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { auth } from "../../firebase-config";
import { sendSignInLinkToEmail } from "firebase/auth";


export function SignUpEmailForm() {

    const navigate = useNavigate();
    const location = useLocation();
    const email: string = location.state?.email; // the email user enters on the first process to see if the email already exists in the databse.

    const [emailS, setEmailS] = useState<string>(email); // the email the user decides to go with when creating an account, default value is kept as the above email.


    // const actionCodeSettings = {
    //     // URL you want to redirect back to. The domain (www.example.com) for this
    //     // URL must be in the authorized domains list in the Firebase Console.
    //     url: 'http://localhost:3000/signUpPwd',
    //     // This must be true.
    //     handleCodeInApp: true,

    // };

    // async function sendVerificationLinkToUser(e: any) {
    //     e.preventDefault();
    //     await sendSignInLinkToEmail(auth, emailS, actionCodeSettings)
    //         .then(() => {
    //             window.localStorage.setItem('emailForSignUp', emailS);
    //             alert("the link has successfully been sent, press ok after verifying using the link");
    //         })
    //         .catch((err) => {
    //             console.log(`this is the error: ${err.message}`)
    //         })
    //     // .finally(() => {

    //     // })
    // }




    // console.log(emailS);
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
                        onSubmit={() => { navigate('/signUpPwd', { state: { emailS: emailS } }) }}
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
                                Create an account
                            </FormLabel>
                        </Flex>

                        <FormHelperText mb={20} alignSelf="center">
                            As you don't have an account we will help you create one ! <br />
                            please enter the email address you'd like to use.
                        </FormHelperText>

                        <Input
                            placeholder="Enter email (work or personal)"
                            h="8%"
                            w="75%"
                            type="email"
                            value={emailS}
                            fontSize="large"
                            onChange={(e) => setEmailS(e.target.value)}
                            focusBorderColor="purple.600"
                            borderColor="black"
                            borderWidth="2px"
                            alignSelf="center"
                            _hover={{}}
                        // defaultValue={email}
                        />


                        <Button
                            isDisabled={!emailS}
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
    )
}