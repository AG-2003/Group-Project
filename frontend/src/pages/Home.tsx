import React, { useState, useEffect } from 'react';
import {
    Box, Flex, Text, Spacer, IconButton, Button, Link, Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';  // For profile icon
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase-config';



export function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         setUser(currentUser);
    //     });

    //     return () => unsubscribe();
    // }, []);

    // const handleSignOut = async () => {
    //     try {
    //         await signOut(auth);
    //         navigate("/login"); // Redirect to the login page after signing out
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };

    return (
        <Box>
            {/* Navbar */}
            <Flex as="nav" p={4} bg="#CBA1A1" boxShadow="md">
                {/* <RouterLink to="/">
                    <Text fontSize="xl" fontWeight="bold" cursor="pointer">AppName</Text>
                </RouterLink> */}
                <Text fontSize="xl" fontWeight="bold" cursor="pointer">AppName</Text>
                <Spacer />
                <Box>
                    {/* Navigation Links */}
                    <Link mx={20}>Option1</Link>
                    <Link mx={20}>Option2</Link>
                    <Link mx={20}>Option3</Link>
                    <Link mx={20}>Option4</Link>
                    <Link mx={20}>Option5</Link>
                </Box>
                <Spacer />
                {/* Profile Icon with Dropdown */}
                <Menu>
                    <MenuButton as={IconButton} aria-label="User Profile" icon={<FaUserCircle size="1.5em" />} />
                    <MenuList>
                        {user ? (
                            <>
                                {/* <MenuItem>{user.email}</MenuItem>
                                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem> */}
                            </>
                        ) : (
                            <MenuItem>Not Logged In</MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Flex>

            {/* Main Content */}
            <Box p={6}>
                {/* {user ? (
                    <Text fontSize="2xl">Welcome, {user.email}! You have successfully been authenticated to our app.</Text>
                ) : (
                    <Text fontSize="2xl">User not authenticated. Please log in.</Text>
                )} */}
            </Box>
        </Box>
    );
}
