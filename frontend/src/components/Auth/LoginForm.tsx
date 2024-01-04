import React, { useEffect } from 'react';
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
import { auth, googleProvider, db, microsoftProvider } from "../../firebase-config"
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { User } from 'firebase/auth'; // Import the User type from your Firebase authentication library


export function LoginForm() {

    const navigate = useNavigate(); // Initialize the navigate function

    let signInMethod = ''
    const signInWithGoogle = async () => {
        // Initiates the Google sign-in redirect when this function is called
        try {
            signInMethod = 'g'
            await signInWithRedirect(auth, googleProvider);

        } catch (err) {
            console.log(err)
        }
    };

    const signInWithMicrosoft = async () => {
        try {
            // Use signInWithRedirect for Microsoft
            signInMethod = 'm'
            await signInWithRedirect(auth, microsoftProvider);
            navigate('/index');
        } catch (err) {
            console.error(err);
        }
    };

    const saveGoogleUserToFirestore = async (user: User) => {
        if (user != null) {
            const userRef = doc(db, 'users', user.uid);
            setDoc(userRef, {
                email: user?.email,

            });
        }
    }

    const saveMicrosoftUserToFirestore = (user: User | null) => {
        if (user != null) {
            const userRef = doc(db, 'users', user.uid);
            setDoc(userRef, {
                email: user?.email,
            });
        }
    }

    const handleRedirectSignIn = async () => {
        try {
            const result = await getRedirectResult(auth);
            const user = result?.user;
            if (user) {
                if (signInMethod == 'g') {
                    await saveGoogleUserToFirestore(user);
                } else {
                    await saveMicrosoftUserToFirestore(user);
                }
                navigate('/index');  // Navigate to /index here
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        handleRedirectSignIn();
    }, []);



    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="purple.200"
        >
            <HStack spacing={0} >
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
                            onClick={signInWithGoogle}
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
                            onClick={signInWithMicrosoft}
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
                            onClick={() => { navigate('/loginEmail') }}
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
