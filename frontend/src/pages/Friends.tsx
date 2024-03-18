import SideBar from "../components/Dashboard/sidebar";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Dashboard/Navbar";
import { db, auth } from "../firebase-config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";


export const Friends: React.FC = () => {
    // const [users, setUsers] = useState([{}]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sidebarVariants = {
        open: { width: '200px' },
        closed: { width: '0px' },
    };

    const bgColor = useColorModeValue('gray.50', 'gray.800');


    // Function to toggle the sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    type User = {
        displayName?: string; // Assuming you have displayName field in your user documents
        email?: string; // Assuming you have an email field in your user documents
    };


    // const fetchUsers = async () => {
    //     setIsLoading(true); // Start loading
    //     const usersColRef = collection(db, 'users');
    //     try {
    //         const usersSnapshot = await getDocs(usersColRef);
    //         const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //         setUsers(usersData);
    //         console.log(users);
    //     } catch (error) {
    //         console.error("Error fetching users: ", error);
    //     }
    //     setIsLoading(false); // Finish loading
    // };

    // useEffect(() => {
    //     fetchUsers();
    // }, []);


    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to search users from Firestore
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const users = querySnapshot.docs
            .map(doc => doc.data())
            .filter(user => user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()));

        setSearchResults(users);
        console.log(searchResults);
    };

    const handleAddFriend = async (friendEmail?: string) => {
        // Logic to send friend request or add friend directly
        // This depends on your database schema
    };




    return (
        <>
            <Box style={{ padding: "10px", background: "#484c6c" }}>
                <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </Box>
            <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
            <Box display="flex" height="calc(100vh - 10px)" width="100%">
                <AnimatePresence>
                    {isSidebarOpen ? (
                        <motion.div
                            initial="open"
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
                    ) : (
                        <motion.div
                            initial="closed"
                            animate="closed"
                            exit="open"
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
                    )}
                </AnimatePresence>
                {/* <Box>
                    <Button onClick={handleSearch}></Button>
                </Box> */}
                <Box>
                    <form onSubmit={handleSearch}>
                        <Input
                            placeholder="Search for friends..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit">Search</Button>
                    </form>
                    <Flex direction="column">
                        {searchResults.map((user, index) => (
                            <Box key={index}>
                                {user.displayName}
                                <Button onClick={() => handleAddFriend(user.email)}>Add Friend</Button>
                            </Box>
                        ))}
                    </Flex>
                </Box>

            </Box>

        </>
    )
}