import SideBar from "../components/Dashboard/sidebar";
import { useCallback, useEffect, useState } from "react";
import {
    Box, Button, Divider, Flex, Input, useColorModeValue, Text, HStack, VStack, IconButton, StackDivider,
    Container, Menu, MenuButton, MenuList, MenuItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, useDisclosure, Heading, ButtonGroup, Tabs, TabList, TabPanels, TabPanel, Tab
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Dashboard/Navbar";
import { db, auth } from "../firebase-config";
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { debounce } from "../utils/Time";
import { UseToastNotification } from "../utils/UseToastNotification";
import cardBg2 from '../assets/carbBg2.png'
import { HamburgerIcon } from "@chakra-ui/icons"; // might replace icon with 3 dot thingy 
import { useReceivedRequests } from "../context/RecievedRequestsContext";
import { useNavigate } from "react-router-dom";
import { getOrCreateChatId } from "../chatService";




interface User {
    id: string;
    username?: string;
    email?: string
    userVisibility?: 'public' | 'private';
    // add other properties as needed
}


export const Friends: React.FC = () => {
    const [users, setUsers] = useState<User[]>();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friends, setFriends] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const { receivedRequests, setReceivedRequests } = useReceivedRequests();
    const navigate = useNavigate();



    // State for managing modal visibility and the current selected friend
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

    const userEmail = auth.currentUser?.email;
    const showToast = UseToastNotification();


    // Function to open modal with the selected friend's details
    const openModal = (friend: User) => {
        setSelectedFriend(friend);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFriend(null);
    };


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

    useEffect(() => {
        const fetchUsers = async () => {
            const usersColRef = collection(db, 'users');
            try {
                const usersSnapshot = await getDocs(usersColRef);
                const usersData = usersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as User))
                    .filter(user => user.email !== auth.currentUser?.email);
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        const fetchFavorites = async () => {
            if (!userEmail) return;
            const userDocRef = doc(db, 'users', userEmail);
            try {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists() && userDocSnap.data()) {
                    const userData = userDocSnap.data();
                    const userFavs: string[] = userData.favorites || [];
                    setFavorites(userFavs);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchUsers();
        fetchFavorites();
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

    // TODO: use batch
    const addFriend = async (friendEmail: string) => {
        if (!userEmail || userEmail === friendEmail) return;

        const userDocRef = doc(db, 'users', userEmail);

        // Get the visibility status of the user to be added
        const friendDocRef = doc(db, 'users', friendEmail);
        const friendDocSnap = await getDoc(friendDocRef);

        if (friendDocSnap.exists() && friendDocSnap.data()) {
            const friendData = friendDocSnap.data();

            // If friend's profile is public, add directly as friends
            if (friendData.userVisibility === 'public') {

                try {
                    // Transaction or batch could be used here for atomicity, ensuring both operations succeed or fail together
                    // Add friend to current user's list
                    await updateDoc(userDocRef, {
                        userFriends: arrayUnion(friendEmail)
                    });

                    // Add current user to friend's list
                    await updateDoc(friendDocRef, {
                        userFriends: arrayUnion(userEmail)
                    });

                    setFriends(prev => [...prev, friendEmail]);
                    showToast('info', 'Added new friend');
                } catch (error) {
                    console.error("Error adding friend:", error);
                    showToast('error', `${error}`);
                }

            } else if (friendData.userVisibility === 'private') {
                // Send a friend request instead
                // For User A (current user sending the request)
                const userDocRef = doc(db, 'users', userEmail);
                await updateDoc(userDocRef, {
                    sentRequests: arrayUnion(friendEmail)
                });
                setSentRequests(prev => [...prev, friendEmail]);

                // For User B (receiving the request)
                await updateDoc(friendDocRef, {
                    receivedRequests: arrayUnion(userEmail)
                });

                showToast('info', `Friend request sent to ${friendEmail}`);
            }
        } else {
            showToast('error', `User not found.`);
        }
    };

    const fetchRecievedRequests = async () => {
        if (!userEmail) return;

        const userDocRef = doc(db, 'users', userEmail);
        const userDocSnapshot = await getDoc(userDocRef);
        try {
            if (userDocSnapshot.exists() && userDocSnapshot.data()) {
                setReceivedRequests(userDocSnapshot.data().receivedRequests || []);
            }

        } catch (err) {
            showToast('error', `${err}`)
        }
    }


    // fetch the received requests from Firestore and setReceivedRequests
    useEffect(() => {
        fetchRecievedRequests();
    }, []);

    // TODO: use batch
    const acceptFriendRequest = async (requesterEmail: string) => {
        if (!receivedRequests.length) return;

        if (!userEmail) return;

        const userDocRef = doc(db, 'users', userEmail);
        const friendDocRef = doc(db, 'users', requesterEmail);

        try {
            const batch = writeBatch(db);


            batch.update(userDocRef, {
                userFriends: arrayUnion(requesterEmail),
                receivedRequests: arrayRemove(requesterEmail)
            });

            // Add current user to friend's list
            batch.update(friendDocRef, {
                userFriends: arrayUnion(userEmail),
                sentRequests: arrayRemove(userEmail)

            });

            await batch.commit();

            setFriends(prev => [...prev, requesterEmail]);
            const updatedReceivedRequests = receivedRequests.filter(req => req !== requesterEmail);
            setReceivedRequests(updatedReceivedRequests);

            showToast('info', 'Added new friend');
        } catch (error) {
            console.error("Error adding friend:", error);
            showToast('error', `Error accepting friend request: ${error}`);
        }
    }


    const rejectFriendRequest = async (requesterEmail: string) => {
        if (!userEmail) return;

        const userDocRef = doc(db, 'users', userEmail);
        const requesterDocRef = doc(db, 'users', requesterEmail);

        try {

            await updateDoc(userDocRef, {
                receivedRequests: arrayRemove(requesterEmail)
            });


            await updateDoc(requesterDocRef, {
                sentRequests: arrayRemove(userEmail)
            });


            const updatedReceivedRequests = receivedRequests.filter(req => req !== requesterEmail);
            setReceivedRequests(updatedReceivedRequests);

            showToast('info', 'Friend request rejected');
        } catch (error) {
            console.error("Error rejecting friend request:", error);
            showToast('error', `Error rejecting friend request: ${error}`);
        }
    };

    const handleAddFavorite = async (friendEmail: string) => {
        if (!userEmail || !friendEmail) return;

        const userDocRef = doc(db, 'users', userEmail);

        try {
            await updateDoc(userDocRef, {
                favorites: arrayUnion(friendEmail)
            });

            setFavorites(prevFavorites => [...favorites, friendEmail]);
            showToast('success', `${friendEmail} added to favorites.`);

        } catch (err) {
            showToast('error', `Failed to add ${friendEmail} to favorites: ${err}`);
        }

    }


    const handleRemoveFavorite = async (friendEmail: string) => {
        if (!userEmail || !friendEmail) return;

        const userDocRef = doc(db, 'users', userEmail);

        try {
            await updateDoc(userDocRef, {
                favorites: arrayRemove(friendEmail)
            });

            // Update the local state to reflect the change
            setFavorites(prevFavorites => prevFavorites.filter(email => email !== friendEmail));

            // Show a success toast notification
            showToast('success', `${friendEmail} removed from favorites.`);
        } catch (err) {
            console.error("Error removing from favorites:", err);
            showToast('error', `Failed to remove ${friendEmail} from favorites: ${err}`);
        }
    }



    const removeFriend = async (friendEmail: string) => {
        if (!userEmail || !friendEmail) return;

        const userDocRef = doc(db, 'users', userEmail);
        const friendDocRef = doc(db, 'users', friendEmail);

        try {

            const batch = writeBatch(db);


            batch.update(userDocRef, {
                userFriends: arrayRemove(friendEmail)
            });


            batch.update(friendDocRef, {
                userFriends: arrayRemove(userEmail)
            });


            await batch.commit();


            setFriends(friends => friends.filter(email => email !== friendEmail));

            showToast('info', `Successfully removed ${friendEmail} from friends.`);
        } catch (error) {
            console.error("Error removing friend:", error);
            showToast('error', `Error removing friend: ${error}`);
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

    const startChat = async (friendEmail: string) => {
        if (!userEmail) {
            showToast('error', 'You must be logged in to start a chat.');
            return;
        }

        try {
            const chatId = await getOrCreateChatId(userEmail, friendEmail);
            navigate(`/chat/${chatId}`);
        } catch (error) {
            console.error("Error getting or creating chatId:", error);
            showToast('error', 'Error starting chat.');
        }
    };


    const menuBg = useColorModeValue('white', 'gray.700');
    const menuItemHoverBg = useColorModeValue('purple.100', 'purple.700');
    const menuItemHoverColor = useColorModeValue('purple.700', 'purple.100');
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

                    {receivedRequests.length > 0 && (
                        <Flex direction="column" mb={6} align="center" >
                            <Box width="100%" maxWidth="1500px" maxHeight="90vh" borderRadius="lg" overflowY="auto" p={6} bgColor='#f4f1fa'>
                                <Text fontSize="2xl" my={4}>
                                    Friend requests
                                </Text>
                                <VStack spacing={5} align="stretch">
                                    {receivedRequests.map((requestEmail) => (
                                        <Flex key={requestEmail} justifyContent="space-between" alignItems="center" p="4" bgImage={cardBg2} borderRadius="md" shadow="base" >
                                            <Text>{requestEmail}</Text>
                                            <ButtonGroup size="sm">
                                                <Button colorScheme="green" onClick={() => acceptFriendRequest(requestEmail)}>Accept</Button>
                                                <Button colorScheme="red" onClick={() => rejectFriendRequest(requestEmail)}>Reject</Button>
                                            </ButtonGroup>
                                        </Flex>
                                    ))}
                                </VStack>
                            </Box>
                        </Flex>
                    )}
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
                                spacing={3}
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
                                        {/* Conditional rendering depending on the friendship and request status */}
                                        {friends.includes(result.email ?? '') ? (
                                            // Show a message or a disabled button for existing friends
                                            <Button isDisabled>Already friends</Button>
                                        ) : sentRequests.includes(result.email ?? '') ? (
                                            // Indicate that a friend request has been sent
                                            <Button isDisabled>Request Sent</Button>
                                        ) : (
                                            <Button
                                                onClick={() => result.email && addFriend(result.email)}
                                                bg="purple.400"
                                                _hover={{ bg: 'purple.500' }}
                                                color="white"
                                            >
                                                {result.userVisibility === 'public' ? 'Add Friend' : 'Request to Add'}
                                            </Button>
                                        )}
                                    </Flex>
                                ))}
                            </VStack>
                            {/* Here begins the Tabs component */}
                            <Tabs isFitted variant="enclosed" mt={8} colorScheme="purple">
                                <TabList mb="1em">
                                    <Tab _selected={{ color: 'white', bg: 'purple.400' }}>My Friends</Tab>
                                    <Tab _selected={{ color: 'white', bg: 'purple.400' }}>Favorites</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <VStack
                                            divider={<StackDivider borderColor="gray.200" />}
                                            spacing={1}
                                            align="stretch"
                                        >
                                            {friends.map((friendEmail) => (
                                                <Flex key={friendEmail} justifyContent="space-between" alignItems="center" p="4" bg="white" borderRadius="md" shadow="base" bgImage={cardBg2}>
                                                    <Text>{friendEmail}</Text>
                                                    <Menu placement="bottom-start" gutter={4} strategy="fixed">
                                                        <MenuButton as={IconButton} icon={<HamburgerIcon />} variant='none' />
                                                        <MenuList bg={menuBg} zIndex={10} minW="240px">
                                                            <MenuItem
                                                                _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                onClick={() => removeFriend(friendEmail)}
                                                            >
                                                                Remove Friend
                                                            </MenuItem>
                                                            <MenuItem
                                                                _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                onClick={() => console.log("View Profile")}
                                                            >
                                                                View User Profile
                                                            </MenuItem>
                                                            <MenuItem
                                                                _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                onClick={() => startChat(friendEmail)}
                                                            >
                                                                Chat
                                                            </MenuItem>
                                                            {favorites.includes(friendEmail) ? (
                                                                <MenuItem
                                                                    _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                    onClick={() => handleRemoveFavorite(friendEmail)} // Implement this function similar to handleAddFavorite
                                                                >
                                                                    Remove from Favorites
                                                                </MenuItem>
                                                            ) : (
                                                                <MenuItem
                                                                    _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                    onClick={() => handleAddFavorite(friendEmail)}
                                                                >
                                                                    Add to Favorites
                                                                </MenuItem>
                                                            )}
                                                        </MenuList>
                                                    </Menu>
                                                </Flex>
                                            ))}
                                        </VStack>
                                    </TabPanel>
                                    <TabPanel>
                                        {/* Mapping over favorites */}
                                        {favorites.length > 0 ? (
                                            <VStack
                                                divider={<StackDivider borderColor="gray.200" />}
                                                spacing={1}
                                                align="stretch"
                                            >
                                                {friends
                                                    .filter((friendEmail) => favorites.includes(friendEmail))
                                                    .map((friendEmail) => (
                                                        <Flex key={friendEmail} justifyContent="space-between" alignItems="center" p="4" bg="white" borderRadius="md" shadow="base" bgImage={cardBg2}>
                                                            <Text>{friendEmail}</Text>
                                                            <Menu placement="bottom-start" gutter={4} strategy="fixed">
                                                                <MenuButton as={IconButton} icon={<HamburgerIcon />} variant='none' />
                                                                <MenuList bg={menuBg} zIndex={10} minW="240px">
                                                                    <MenuItem
                                                                        _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                        onClick={() => removeFriend(friendEmail)}
                                                                    >
                                                                        Remove Friend
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                        onClick={() => console.log("View Profile")}
                                                                    >
                                                                        View User Profile
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                        onClick={() => console.log("Chat")}
                                                                    >
                                                                        Chat
                                                                    </MenuItem>
                                                                    {favorites.includes(friendEmail) ? (
                                                                        <MenuItem
                                                                            _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                            onClick={() => handleRemoveFavorite(friendEmail)} // Implement this function similar to handleAddFavorite
                                                                        >
                                                                            Remove from Favorites
                                                                        </MenuItem>
                                                                    ) : (
                                                                        <MenuItem
                                                                            _hover={{ bg: menuItemHoverBg, color: menuItemHoverColor }}
                                                                            onClick={() => handleAddFavorite(friendEmail)}
                                                                        >
                                                                            Add to Favorites
                                                                        </MenuItem>
                                                                    )}
                                                                </MenuList>
                                                            </Menu>
                                                        </Flex>
                                                    ))
                                                }
                                            </VStack>
                                        ) : (
                                            <Text>No favorites yet.</Text>
                                        )}

                                    </TabPanel>
                                </TabPanels>
                            </Tabs>

                        </Box>

                    </Flex>
                </Box >
            </Box >
        </>
    )
}
