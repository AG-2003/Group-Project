import React, { useState } from 'react';
import NavBar from '../components/Dashboard/Navbar';
import Sidebar from '../components/Dashboard/sidebar';
import ChatRoom from '../components/UserChat/ChatRoom';
import { Box, Divider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

export const UserChats: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sidebarVariants = {
        open: { width: '200px' },
        closed: { width: '0px' },
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const otherUserName: string = 'test';
    return (
        <>
            <NavBar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
            <Box display="flex" height="94vh"> {/* Set the height to 100vh */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                width: '200px', // Set the width here
                                paddingTop: '10px',
                                backgroundColor: '#f4f1fa',
                                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                                overflowY: 'auto', // If sidebar content is too long, let it scroll
                            }}
                        >
                            <Sidebar />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Box flex="1" overflowY="hidden"> {/* Overflow here should be hidden */}
                    <ChatRoom />
                </Box>
            </Box>
        </>
    );
};
