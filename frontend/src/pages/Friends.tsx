import SideBar from "../components/Dashboard/sidebar";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, Flex, Input, useColorModeValue, Text, HStack, VStack, IconButton, StackDivider, Container } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Dashboard/Navbar";
import { db, auth } from "../firebase-config";
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { CloseIcon } from "@chakra-ui/icons";
import { debounce } from "../utils/Time";
import { UseToastNotification } from "../utils/UseToastNotification";
import cardBg2 from '../assets/carbBg2.png'
import { url } from "inspector";


interface User {
    id: string;
    username?: string;
    email?: string
    // add other properties as needed
}


export const Friends: React.FC = () => {
    const [users, setUsers] = useState<User[]>();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friends, setFriends] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const userEmail = auth.currentUser?.email;
    const showToast = UseToastNotification();


    const sidebarVariants = {
        open: { width: '200px' },
        closed: { width: '0px' },
    };

    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const searchBoxBg = useColorModeValue('purple.50', 'purple.700');
    const addButtonBg = useColorModeValue('purple.200', 'purple.500');
    const addButtonHoverBg = useColorModeValue('purple.100', 'purple.700');
    const inputTextColor = useColorModeValue('gray.800', 'white');
    const resultTextColor = useColorModeValue('gray.700', 'gray.200');


    // Function to toggle the sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const debouncedSearchTerm = useCallback(debounce(handleSearchChange, 500), []);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersColRef = collection(db, 'users');
            try {
                const usersSnapshot = await getDocs(usersColRef);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);



    useEffect(() => {
        if (searchTerm !== '') {
            const filteredUsers = (users || []).filter(user =>
                user.id.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                (user.username && user.username.toLowerCase().startsWith(searchTerm.toLowerCase()))
            );
            setSearchResults(filteredUsers);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, users]);


    const addFriend = async (friendEmail: string) => {
        if (!userEmail) return;
        const userDocRef = doc(db, 'users', userEmail);
        try {
            await updateDoc(userDocRef, {
                userFriends: arrayUnion(friendEmail)
            });
            setFriends(prev => [...prev, friendEmail]);
            showToast('info', 'Added new friend');
        } catch (error) {
            console.error("Error adding friend:", error);
            showToast('error', `${error}`);
        }
    };
    const removeFriend = async (friendEmail: string) => {
        if (!userEmail) return;
        const userDocRef = doc(db, 'users', userEmail);
        try {
            await updateDoc(userDocRef, {
                userFriends: arrayRemove(friendEmail)
            });
            setFriends(friends => friends.filter(email => email !== friendEmail));
            showToast('info', 'You have successfully removed a friend');
        } catch (error) {
            console.error("Error removing friend:", error);
            showToast('error', `${error}`);
        }
    };


    const fetchUserFriends = async () => {
        if (!userEmail) return;
        const userDocRef = doc(db, 'users', userEmail);
        try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setFriends(userData.userFriends || []);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user friends: ", error);
            showToast('error', `Error fetching friends: ${error}`);
        }
    };

    useEffect(() => {
        fetchUserFriends();
    }, []);

    // Calls fetchUserFriends whenever you add a friend
    const addFriendAndUpdate = async (friendEmail: string) => {
        await addFriend(friendEmail);
        await fetchUserFriends();
    };

    return (
        <>
            <Box padding="10px" background="#484c6c">
                <Navbar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            </Box>
            <Divider borderColor="lightgrey" borderWidth="1px" maxWidth="98.5vw" />
            <Box display="flex" height="calc(100vh - 10px)" width="100%">
                <AnimatePresence>
                    {isSidebarOpen ? (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                paddingTop: "10px",
                                height: "inherit",
                                backgroundColor: "#f4f1fa",
                                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                            }}
                        >
                            <SideBar />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                <Box flex="1" display="flex" flexDirection="column" p="4" bgColor='white'>
                    <Flex direction="column" align="center" h="100vh" >
                        <Box width="100%" maxWidth="1500px" maxHeight="90vh" p={6} boxShadow="xl" borderRadius="lg" overflowY="auto" bgColor='#f4f1fa'>
                            <Text fontSize="2xl" my={4}>
                                Add Friends
                            </Text>
                            <Input
                                placeholder="Search by email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                mb={4}
                                size="lg"
                                borderColor='purple.400'
                                _focus={{ borderColor: 'purple.500' }}
                                _hover={{ borderColor: 'none' }}
                            />

                            <VStack
                                divider={<StackDivider borderColor="gray.200" />}
                                spacing={4}
                                align="stretch"
                            >
                                {searchResults.map((result) => (
                                    <Flex
                                        key={result.id}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        p="4"
                                        bg="white"
                                        borderRadius="md"
                                        shadow="base"
                                        bgImage={cardBg2}
                                    >
                                        <Text>{result.email ?? result.username ?? result.id}</Text>
                                        <Button
                                            onClick={() => addFriend(result.email ?? result.id)}
                                            bg="purple.400"
                                            _hover={{ bg: 'purple.500' }}
                                            color="white"
                                        >
                                            Add Friend
                                        </Button>
                                    </Flex>
                                ))}
                            </VStack>
                            <Text fontSize="2xl" my={4}>
                                My Friends
                            </Text>
                            <Divider my={4} />
                            <VStack
                                divider={<StackDivider borderColor="gray.200" />}
                                spacing={4}
                                align="stretch"
                            >
                                {friends.map((friendEmail) => (
                                    <Flex
                                        key={friendEmail}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        p="4"
                                        bg="white"
                                        borderRadius="md"
                                        shadow="base"
                                        bgImage={cardBg2}
                                    >
                                        <Text>{friendEmail}</Text>
                                        <Button
                                            onClick={() => removeFriend(friendEmail)}
                                            bg="red.300"
                                            _hover={{ bg: 'red.500' }}
                                            color="white"
                                        >
                                            remove Friend
                                        </Button>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    </Flex>
                </Box>
            </Box >
        </>
    )
}



{/* <Box padding="10px" background="#484c6c">
                <Navbar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            </Box>
            <Divider borderColor="lightgrey" borderWidth="1px" maxWidth="98.5vw" />
            <Box display="flex" height="calc(100vh - 10px)" width="100%">
                <AnimatePresence>
                    {isSidebarOpen ? (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                paddingTop: "10px",
                                height: "inherit",
                                backgroundColor: "#f6f6f6",
                                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                            }}
                        >
                            <SideBar />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                <Box flex="1" display="flex" flexDirection="column" p="4">
                    <Input
                        placeholder="Search by email or username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                        borderColor="purple.200"
                        _placeholder={{ color: 'gray.500' }}
                    />
                    <VStack
                        spacing="4"
                        mt="4"
                        divider={<StackDivider borderColor="gray.200" />}
                        align="stretch"
                    >
                        {searchResults.map((result) => (
                            <Flex
                                key={result.id}
                                justifyContent="space-between"
                                alignItems="center"
                                p="4"
                                bg="white"
                                borderRadius="md"
                                shadow="base"
                                bgImage={cardBg2}
                            >
                                <Text>{result.email ?? result.username ?? result.id}</Text>
                                <Button
                                    onClick={() => addFriend(result.email ?? result.id)}
                                    bg="purple.400"
                                    _hover={{ bg: 'purple.500' }}
                                    color="white"
                                >
                                    Add Friend
                                </Button>
                            </Flex>
                        ))}
                    </VStack>
                    <Text mt="8" mb="4" fontSize="xl" fontWeight="bold">
                        My Friends
                    </Text>
                    <VStack
                        spacing="4"
                        mt="4"
                        divider={<StackDivider borderColor="gray.200" />}
                        align="stretch"
                    >
                        {friends.map((friendEmail) => (
                            <Flex
                                key={friendEmail}
                                justifyContent="space-between"
                                alignItems="center"
                                p="4"
                                bg="white"
                                borderRadius="md"
                                shadow="base"
                                bgImage={cardBg2}
                            >
                                <Text>{friendEmail}</Text>
                                <Button
                                    onClick={() => removeFriend(friendEmail)}
                                    bg="red.300"
                                    _hover={{ bg: 'red.500' }}
                                    color="white"
                                >
                                    remove Friend
                                </Button>
                            </Flex>
                        ))}
                    </VStack>
                </Box>
            </Box> */}