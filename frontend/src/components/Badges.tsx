import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Heading, Divider, Badge, useColorModeValue, IconButton, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import Navbar from '../components/Dashboard/Navbar';
import SideBar from '../components/Dashboard/sidebar';
import carbBg2 from '../assets/carbBg2.png';
import { BadgesType } from '../interfaces/BadgesType';
import { db } from '../firebase-config';
import { auth } from '../firebase-config';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { UseToastNotification } from '../utils/UseToastNotification';
export const Badges: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tasks, setTasks] = useState<BadgesType[]>([]);
    const showToast = UseToastNotification();

    const email = auth.currentUser?.email;


    const sidebarVariants = {
        open: { width: '200px' },
        closed: { width: '0px' },
    };

    const bgColor = useColorModeValue('gray.50', 'gray.800');


    // Function to toggle the sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchUserTasks = async () => {
        if (email) {
            const userRef = doc(db, 'users', email);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userBadges: BadgesType[] = userData.Badges.map((badge: BadgesType) => ({
                    name: badge.name,
                    status: badge.status,
                }));


                setTasks(userBadges);
            } else {
                console.log("No such document!");
            }
        } else {
            console.log("No authenticated user!");
        }
    }

    useEffect(() => {
        fetchUserTasks();
    }, [fetchUserTasks])

    const updateCreateDocTask = async () => {
        if (email) {
            const docRef = doc(db, 'users', email)
            const userDoc = await getDoc(docRef);
            if (userDoc.exists()) {
                const userDocData = userDoc.data();
                const badges: BadgesType[] = userDocData.Badges || [];
                const createDocumentBadgeIndex: number = badges.findIndex(badge => badge.name === 'Create a document');

                if (userDoc.data().documents && !badges[createDocumentBadgeIndex].status && createDocumentBadgeIndex !== -1) {
                    badges[createDocumentBadgeIndex].status = true;
                    await updateDoc(docRef, {
                        Badges: badges
                    })
                }
            }

        }
    }

    useEffect(() => {
        updateCreateDocTask();
    }, [updateCreateDocTask])


    const updateCreateSheetTask = async () => {
        if (email) {
            const docRef = doc(db, 'users', email);
            const userDoc = await getDoc(docRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const badges: BadgesType[] = userData.Badges || [];
                const createSheetTaskIndex: number = badges.findIndex(badge => badge.name === 'Create a spreadsheet');
                if (userDoc.data().sheets.length > 0 && !badges[createSheetTaskIndex].status && createSheetTaskIndex !== -1) {
                    badges[createSheetTaskIndex].status = true;
                    await updateDoc(docRef, {
                        Badges: badges
                    })
                }

            }
        }
    }

    useEffect(() => {
        updateCreateSheetTask();
    }, [updateCreateSheetTask])


    const updateCreateBoardTask = async () => {
        if (email) {
            const docRef = doc(db, 'users', email);
            const userDoc = await getDoc(docRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const badges: BadgesType[] = userData.Badges || [];
                const createBoardTaskIndex: number = badges.findIndex(badge => badge.name === 'Create a whiteboard');
                if (userDoc.data().boards && !badges[createBoardTaskIndex].status && createBoardTaskIndex !== -1) {
                    badges[createBoardTaskIndex].status = true;
                    await updateDoc(docRef, {
                        Badges: badges
                    })
                }

            }
        }
    }

    useEffect(() => {
        updateCreateBoardTask();
    }, [updateCreateBoardTask])


    const updateJoinTeamTask = async () => {
        if (email) {
            const docRef = doc(db, 'users', email);
            const userDoc = await getDoc(docRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const badges: BadgesType[] = userData.Badges || [];
                const joinTeamTaskIndex: number = badges.findIndex(badge => badge.name === 'Join a team');

                if (userDoc.data().teams && !badges[joinTeamTaskIndex].status && joinTeamTaskIndex !== -1) {
                    badges[joinTeamTaskIndex].status = true;
                    await updateDoc(docRef, {
                        Badges: badges
                    })
                }

            }
        }
    }

    useEffect(() => {
        updateJoinTeamTask();
    }, [updateJoinTeamTask])


    const updateJoinCommunityTask = async () => {
        if (email) {
            const docRef = doc(db, 'users', email);
            const userDocData = await getDoc(docRef);
            if (userDocData.exists()) {
                const userData = userDocData.data();
                const badges: BadgesType[] = userData.Badges || [];
                const joinCommunityTaskIndex: number = badges.findIndex(badge => badge.name === 'join a community');

                if (userDocData.data().communities && !badges[joinCommunityTaskIndex].status && joinCommunityTaskIndex !== -1) {
                    badges[joinCommunityTaskIndex].status = true;
                    await updateDoc(docRef, {
                        Badges: badges
                    })
                }
            }
        }
    }

    useEffect(() => {
        updateJoinCommunityTask();
    }, [updateJoinCommunityTask])


    return (
        <>
            <Box padding="10px" background="#484c6c">
                <Navbar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            </Box>
            <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
            <Box display="flex" height="calc(100vh - 10px)" width="100%">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sidebarVariants}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                paddingTop: '10px',
                                height: 'inherit',
                                backgroundColor: '#f4f1fa',
                                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden',
                            }}
                        >
                            <SideBar />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Box flex="1" overflowY="auto">
                    <Flex direction="column" align="flex-start" mb={4} ml={4}>
                        <Heading size="xl" mb={2} >BADGES</Heading>
                        <Text fontSize="lg">Complete these tasks below to earn badges.</Text>
                    </Flex>
                    <Divider my={4} />
                    {tasks.map((task, index) => (
                        <Box
                            key={index}
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            bg={`url(${carbBg2})`}
                            m={2}
                            borderRadius="md"
                            _hover={{ shadow: 'lg' }}
                        >
                            <Flex align="center" justify="space-between">
                                <Text fontWeight="bold">{task.name}</Text>
                                <IconButton
                                    aria-label={task.status ? 'Task completed' : 'Task not completed'}
                                    icon={task.status ? <CheckIcon /> : <CloseIcon />}
                                    isRound
                                    size="sm"
                                    colorScheme={task.status ? 'green' : 'red'}
                                />
                            </Flex>
                            {task.status && (
                                <Badge colorScheme="green" ml="1" mt="2">
                                    Completed
                                </Badge>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
};
