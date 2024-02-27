import React, { useState } from 'react';
import { Box, Flex, Text, Heading, Divider, Badge, useColorModeValue, IconButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import Navbar from '../components/Dashboard/Navbar';
import SideBar from '../components/Dashboard/sidebar';
import carbBg2 from '../assets/carbBg2.png';

// sample tasks for now, have to add more and make it dynamic.
const tasks = [
    { name: 'Complete profile', completed: true },
    { name: 'Create a document', completed: false },
    { name: 'Join a team', completed: false },
    { name: 'join a community', completed: false },
    { name: 'Post in any community', completed: false },
    { name: 'Get 10 likes on a community Post', completed: false },
    { name: 'Get 100 likes on a community Post', completed: false },
    { name: 'Get 500 likes on a community Post', completed: false },
    { name: 'Get 1000 likes on a community Post', completed: false },
    { name: 'Get 5000 likes on a community Post', completed: false },
    { name: 'Get 10000 likes on a community Post', completed: false },
    { name: 'Place top 3 in a community leaderboard', completed: false },
    { name: 'Place 1st in a community leaderboard', completed: false },
    { name: 'Create a community', completed: false },
    { name: 'Reach 10 daily user in your community', completed: false },
    { name: 'Reach 100 daily user in your community', completed: false },
    { name: 'Reach 500 daily user in your community', completed: false },
    { name: 'Reach 1000 daily user in your community', completed: false },


    // Add more tasks here
];

export const Badges: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const sidebarVariants = {
        open: { width: '200px' },
        closed: { width: '0px' },
    };

    const bgColor = useColorModeValue('gray.50', 'gray.800');
    

    // Function to toggle the sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            <div style={{ padding: '10px', background: '#484c6c' }}>
                <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </div>
            <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
            <Flex
                height="calc(100vh - 10px)"
                bg={bgColor}
                p={5} // Padding inside the main content box
            >
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
                                backgroundColor: '#f6f6f6',
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
                                    aria-label={task.completed ? 'Task completed' : 'Task not completed'}
                                    icon={task.completed ? <CheckIcon /> : <CloseIcon />}
                                    isRound
                                    size="sm"
                                    colorScheme={task.completed ? 'green' : 'red'}
                                />
                            </Flex>
                            {task.completed && (
                                <Badge colorScheme="green" ml="1" mt="2">
                                    Completed
                                </Badge>
                            )}
                        </Box>
                    ))}
                </Box>
            </Flex>
        </>
    );
};
