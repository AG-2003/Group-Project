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

  const [isDesktop, setIsDesktop] = useState(true);
  const [wasManuallyClosed, setWasManuallyClosed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
    };
    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isDesktop]);

  useEffect(() => {
    // Function to automatically check the sidebar status on window resize
    const checkSidebar = () => {
      const mobileBreakpoint = 768;
      // Close the sidebar if window size is less than the breakpoint and it was not manually closed
      if (window.innerWidth < mobileBreakpoint && !wasManuallyClosed) {
        setIsSidebarOpen(false);
      } else if (window.innerWidth >= mobileBreakpoint && !wasManuallyClosed) {
        // Reopen the sidebar when window size is above the breakpoint and it was not manually closed
        setIsSidebarOpen(true);
      }
    };
    // Set up the event listener
    window.addEventListener("resize", checkSidebar);

    // Check the initial size of the window
    checkSidebar();

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", checkSidebar);
  }, [wasManuallyClosed]);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  const sidebarVariantsMobile = {
    open: { width: "100%" },
    closed: { width: "0px" },
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchUserTasks = async () => {
    if (email) {
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userBadges: BadgesType[] = userData.Badges.map(
          (badge: BadgesType) => ({
            name: badge.name,
            status: badge.status,
          })
        );

        setTasks(userBadges);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No authenticated user!");
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks]);

  const updateCreateDocTask = async () => {
    if (email) {
      const docRef = doc(db, "users", email);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const userDocData = userDoc.data();
        const badges: BadgesType[] = userDocData.Badges || [];
        const createDocumentBadgeIndex: number = badges.findIndex(
          (badge) => badge.name === "Create a document"
        );

        if (
          userDoc.data().documents &&
          !badges[createDocumentBadgeIndex].status &&
          createDocumentBadgeIndex !== -1
        ) {
          badges[createDocumentBadgeIndex].status = true;
          await updateDoc(docRef, {
            Badges: badges,
          });
        }
      }
    }
  };

  useEffect(() => {
    updateCreateDocTask();
  }, [updateCreateDocTask]);

  const updateCreateSheetTask = async () => {
    if (email) {
      const docRef = doc(db, "users", email);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const badges: BadgesType[] = userData.Badges || [];
        const createSheetTaskIndex: number = badges.findIndex(
          (badge) => badge.name === "Create a spreadsheet"
        );
        if (
          userDoc.data().sheets.length > 0 &&
          !badges[createSheetTaskIndex].status &&
          createSheetTaskIndex !== -1
        ) {
          badges[createSheetTaskIndex].status = true;
          await updateDoc(docRef, {
            Badges: badges,
          });
        }
      }
    }
  };

  useEffect(() => {
    updateCreateSheetTask();
  }, [updateCreateSheetTask]);

  const updateCreateBoardTask = async () => {
    if (email) {
      const docRef = doc(db, "users", email);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const badges: BadgesType[] = userData.Badges || [];
        const createBoardTaskIndex: number = badges.findIndex(
          (badge) => badge.name === "Create a whiteboard"
        );
        if (
          userDoc.data().boards &&
          !badges[createBoardTaskIndex].status &&
          createBoardTaskIndex !== -1
        ) {
          badges[createBoardTaskIndex].status = true;
          await updateDoc(docRef, {
            Badges: badges,
          });
        }
      }
    }
  };

  useEffect(() => {
    updateCreateBoardTask();
  }, [updateCreateBoardTask]);

  const updateJoinTeamTask = async () => {
    if (email) {
      const docRef = doc(db, "users", email);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const badges: BadgesType[] = userData.Badges || [];
        const joinTeamTaskIndex: number = badges.findIndex(
          (badge) => badge.name === "Join a team"
        );

        if (
          userDoc.data().teams &&
          !badges[joinTeamTaskIndex].status &&
          joinTeamTaskIndex !== -1
        ) {
          badges[joinTeamTaskIndex].status = true;
          await updateDoc(docRef, {
            Badges: badges,
          });
        }
      }
    }
  };

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
    <div style={{ position: "fixed", width: "100%" }}>
      <Navbar
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box
        display="flex"
        height="calc(100vh - 10px)"
        width="100%"
        position="relative"
      >
        {isDesktop && (
          <AnimatePresence>
            {isSidebarOpen && (
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
            )}
          </AnimatePresence>
        )}
        {!isDesktop && (
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariantsMobile}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  paddingTop: "10px",
                  height: "inherit",
                  backgroundColor: "#f4f1fa",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "absolute",
                  zIndex: "2",
                }}
              >
                <SideBar />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <Box flex="1" overflowY="auto" position="relative" zIndex="1">
          <Flex direction="column" align="flex-start" mb={4} ml={4}>
            <Heading size="xl" mb={2}>
              BADGES
            </Heading>
            <Text fontSize="lg">
              Complete these tasks below to earn badges.
            </Text>
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
              _hover={{ shadow: "lg" }}

              
            >
              <Flex align="center" justify="space-between">
                <Text fontWeight="bold">{task.name}</Text>
                <IconButton
                  aria-label={
                    task.status ? "Task completed" : "Task not completed"
                  }
                  icon={task.status ? <CheckIcon /> : <CloseIcon />}
                  isRound
                  size="sm"
                  colorScheme={task.status ? "green" : "red"}
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
    </div>
  );
};

