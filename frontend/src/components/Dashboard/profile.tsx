import React, { useEffect, useState, useCallback } from "react";
import "tailwindcss/tailwind.css";
import {
  Flex,
  Text,
  Badge,
  Stack,
  Avatar,
  Grid,
  GridItem,
  Heading,
  VStack,
  Button,
  Box,
  Divider,
  SkeletonCircle,
  Skeleton,
  Spinner,
  HStack,
  Spacer,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from "@chakra-ui/react";
import { auth, db } from "../../firebase-config";
import { UseUserProfilePic } from "../../hooks/UseUserProfilePic";
import "./Profile.scss"; // Make sure this path is correct
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "./sidebar";
import { doc, getDoc, getDocsFromCache } from "firebase/firestore";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { SuiteData } from "../../interfaces/SuiteData";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiAward, FiClipboard, FiFileText, FiGrid } from "react-icons/fi";
import { BadgesType } from "../../interfaces/BadgesType";
import DocBg from "../../assets/DocBg.png";
import BoardBg from "../../assets/BoardBg.png";
import SheetBg from "../../assets/SheetBg.png";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventType } from '../../interfaces/EventType';
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { CalendarComponent } from "../Calendar/CalendarComponent";
import { fetchTodaysEvents } from "../../utils/TodaysEvents";

import Modal from "./sub-components/Modal";

// Define an interface for the props if you're using TypeScript
interface StatCardProps {
  title: string;
  value: number | string;
}

// Card component for individual stats
const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <Box
      bgColor='#dcdcf6'
      p={3}
      shadow="xl" // Adding more pronounced shadow
      borderWidth="1px"
      borderRadius="2xl" // Making the boxes more rounded
      width="100%"
      textAlign="center"
      transition="transform 0.2s, shadow 0.2s" // Smooth transition for hover effects
      _hover={{
        transform: "scale(1.02)", // Slightly scale up the card on hover
        shadow: "lg", // Increase shadow intensity on hover
      }}
    >
      <Text fontWeight="medium" fontSize="xl">
        {value}
      </Text>
      <Text fontSize="lg" color="gray.500">
        {title}
      </Text>
    </Box>
  );
};

const Profile: React.FC = () => {
  const userProfile = UseUserProfilePic();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State to track whether the sidebar was manually closed by the user
  const [wasManuallyClosed, setWasManuallyClosed] = useState(false);
  const [isLoadingDesc, setIsLoadingDesc] = useState<boolean>(true);

  const [user] = useAuthState(auth);
  const [totalNoOfProjects, setTotalNoOfProjects] = useState<number>(0);
  const [totalNoOfAwards, setTotalNoOfAwards] = useState<number>(0);
  const [totalNoOfCommunities, setTotalNoOfCommunities] = useState<number>(0);
  const [lastAccessedProjects, setLastAccessedProjects] = useState<SuiteData[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<EventType[]>();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);


  //@daawar TODO: this can be used
  const [modalType, setModalType] = useState("");
  //@daawar TODO: this can be used
  const openModal = (type: string) => setModalType(type);

  //@daawar TODO: this can be used
  const closeModal = () => setModalType("");

  // @daawar TODO: please complete the logic for this
  const handleConfirmModal = (type: string) => {
    closeModal();
  };


  const navigate = useNavigate();

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  const sidebarVariantsMobile = {
    open: { width: "100%" },
    closed: { width: "0px" },
  };

  // This function is called when the toggle button is clicked
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // If toggling the sidebar, we record the action as a manual close/open
    setWasManuallyClosed(true);
  };

  const [userDescription, setUserDescription] = useState<string>("");

  useEffect(() => {
    const fetchDescription = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.email as string);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data().desc) {
            setUserDescription(docSnap.data().desc);
            setIsLoadingDesc(false);
          } else {
            setUserDescription("No description set.");
            setIsLoadingDesc(false);
          }
        } catch (error) {
          console.error("Error fetching user description:", error);
          setUserDescription("Failed to fetch description.");
          setIsLoadingDesc(false);
        }
      }
    };

    fetchDescription();
    getTotalNoOfProjects();
    getTotalNoOfAwards();
    getTotalNoOfCommunities();


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

  //---------------------Calculate no. of projects---------------

  const getTotalNoOfProjects = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userDocuments: SuiteData[] = userData.documents || [];
        const userSheets: SuiteData[] = userData.sheets || [];
        const userWhiteboards: SuiteData[] = userData.boards || [];

        // Use the existing lastEdited field from Firestore data, don't generate a new one
        let combinedProjects: SuiteData[] = [
          ...userDocuments,
          ...userSheets,
          ...userWhiteboards,
        ];

        combinedProjects = combinedProjects.filter(
          (project: SuiteData) => !project.isTrash
        );

        setTotalNoOfProjects(combinedProjects.length);
      }
    }
  };
  //_____________________________________________


  const fetchAndSortProjects = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        let combinedProjects: SuiteData[] = [
          ...(userData.documents || []),
          ...(userData.sheets || []),
          ...(userData.boards || []),
        ];

        combinedProjects = combinedProjects
          .filter((project: SuiteData) => !project.isTrash)
          .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());

        setLastAccessedProjects(combinedProjects);
      }
    }
  };

  useEffect(() => {
    fetchAndSortProjects();

  }, [user]);




  const handleOpenProject = (projectId: string, projectTitle: string, type: string) => {
    // Construct the path in the same way as in Projects.tsx
    let path = '';
    switch (type) {
      case 'document':
        path = `/doc/?id=${encodeURIComponent(projectId)}`;
        break;
      case 'sheet':
        path = `/sheet/?id=${encodeURIComponent(projectId)}`;
        break;
      case 'board':
        path = `/board/?id=${encodeURIComponent(projectId)}`;
        break;

    }
    navigate(path, { state: { projectTitle } });
  };


  const getImageForType = (type: string): string => {
    switch (type) {
      case "document":
        return DocBg;
      case "board":
        return BoardBg;
      case "sheet":
        return SheetBg;
      default:

        return "";
    }
  };

  //--------------------calculate communities-----------

  const getTotalNoOfCommunities = async () => {
    if (user?.email) {
      const docRef = doc(db, 'users', user.email);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const comms: [] = userData.communities;
        if(comms && comms.length){
          setTotalNoOfCommunities(comms.length);
        } else {
          setTotalNoOfCommunities(0)
        }
      }
    }
  }

  //-------------------Calculate no. of awards----------------------

  const getTotalNoOfAwards = async () => {
    if (user?.email) {
      const docRef = doc(db, "users", user?.email);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const badges: BadgesType[] = userData.Badges || [];
        const awards: BadgesType[] = badges.filter(
          (badge) => badge.status === true
        );
        setTotalNoOfAwards(awards.length);
      }
    }
  };


  //--------------------Fetching events for today of the user-------------

  useEffect(() => {
    const fetchEvents = async () => {
      if (auth.currentUser?.email) {
        try {
          const allEvents = await fetchTodaysEvents(auth.currentUser.email);
          if (allEvents) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysEvents = allEvents.filter(event => {
              const eventStartDate = new Date(event.start);
              eventStartDate.setHours(0, 0, 0, 0); // Set to start of event start date
              const eventEndDate = event.end ? new Date(event.end) : new Date(event.start);
              eventEndDate.setHours(23, 59, 59, 999); // Set to end of event end date

              return eventStartDate.getTime() === today.getTime() ||
                (eventStartDate <= today && today <= eventEndDate);
            });
            setTodaysEvents(todaysEvents);
          }
        } catch (error) {
          console.error("Error fetching today's events:", error);
        }
      }
    };

    fetchEvents();
  }, [auth.currentUser]);




  const getPriorityColorScheme = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };


  const renderEventRows = (events: EventType[]) => {
    return events.map((event, index) => (
      <Tr key={index}>
        <Td>{event.title}</Td>
        <Td>{new Date(event.start).toLocaleString()}</Td>
        <Td>{event.end ? new Date(event.end).toLocaleString() : 'N/A'}</Td>
        <Td>
          <Badge colorScheme={getPriorityColorScheme(event.priority)}>
            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
          </Badge>
        </Td>
      </Tr>
    ));
  };



  return (
    <div style={{ position: "fixed", width: "100%"}}>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)" position="relative">
      {!isDesktop && (
        <AnimatePresence>
          {isSidebarOpen ? (
            <motion.div
              initial="open"
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
          ) : (
            <motion.div
              initial="closed"
              animate="clsoed"
              exit="open"
              variants={sidebarVariantsMobile}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                paddingTop: "10px",
                height: "inherit",
                backgroundColor: "#f6f6f6",
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
      {isDesktop && (
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
                backgroundColor: "#f4f1fa",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                flexShrink: "0",
              }}
            >
              <SideBar />
            </motion.div>
          ) : (
            <motion.div
              initial="closed"
              animate="clsoed"
              exit="open"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                paddingTop: "10px",
                height: "inherit",
                backgroundColor: "#f6f6f6",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                flexShrink: "0",
              }}
            >
              <SideBar />
            </motion.div>
          )}
        </AnimatePresence>
      )}
        <Box width="full" m={4} overflowY='auto' position="relative" zIndex='1'>
          {/* User Info Box */}{" "}
          {/* <Heading size="sm" mb={3} p={4} pl={4}>
            Dashboard
          </Heading> */}
          <Flex justify="center">
            {/* Flex container to center the Box */}
            <Box
              bg="#dcdcf6"
              p={3}
              shadow="xl"
              borderWidth="1px"
              borderRadius="2xl"
              textAlign="center"
              mb={6}
              mt={3}
              mx={4}
              width="full"
              transition="transform 0.2s, shadow 0.2s"
              _hover={{
                transform: "scale(1.02)",
                shadow: "lg",
              }}
            >
              <Avatar
                size="xl"
                src={userProfile.photoURL || "fallback_image_url"}
                name={userProfile.displayName}
                mb={4}
              />
              <VStack spacing={2} align="stretch">
                <ChakraLink
                  fontWeight="bold"
                  fontSize='x-large'
                  as={ReactRouterLink}
                  to="/settings"
                  className="profile-name"
                >
                  {userProfile.displayName ||
                    auth.currentUser?.displayName ||
                    "Set username here"}
                </ChakraLink>
                <ChakraLink
                  fontWeight="semibold"
                  fontSize="md"
                  as={ReactRouterLink}
                  to="/settings"
                  className="profile-description"
                >
                  {userDescription || "No description set."}
                </ChakraLink>
              </VStack>
            </Box>
          </Flex>
          {/* Content below User Info Box */}
          <Flex direction={{ base: "column", md: "row" }} mx={4}>
            {/* Left Section: Stats, Leaderboard, and Recent Designs */}
            <Flex
              direction="column"
              width={{ base: "full", lg: "60%" }}
              pr={{ lg: 4 }}
            >
              {/* Stats Cards */}
              <Stack
                borderRadius={20}

                direction={{ base: "column", md: "row" }}
                spacing={{ base: 4, md: 4 }}
                marginBottom={6}
                // m={4}
                p={4}
                width="100%"
                align="center" // Aligns items in the center
                justify="center"
              >
                <StatCard title="Projects" value={totalNoOfProjects} />
                <StatCard title="Communities" value={totalNoOfCommunities} />
                <StatCard title="Awards" value={totalNoOfAwards} />
              </Stack>

              {/* Leaderboard Button */}
              {/* <Button
                bg="#845cd4" // Set the button color
                color="white" // Set the text color to white for contrast
                size="lg"
                mt={6}
                m={4}
                as={ReactRouterLink}
                to="/leaderboard"
                flexShrink={0} // Prevent the button from shrinking
                minWidth="initial" // Set a minimum width if needed
                _hover={{
                  bg: "#6e4ac2", // Slightly darker shade on hover for a subtle effect
                }}
                _active={{
                  bg: "#5c3999", // Even darker shade when the button is clicked
                }}
              >
                Leaderboard
              </Button> */}

              {/* Last Accessed Projects */}
              <Heading size="md" mb={3} pl={4} pt={4}>
                Last Accessed Projects
              </Heading>
              {lastAccessedProjects.length > 0 ? (
                <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
                  {lastAccessedProjects.map((project) => (
                    <GridItem key={project.id} w="100%" minW="220px">
                      <Box
                        h="140px"
                        bgImage={`url(${getImageForType(project.type)})`}
                        bgPosition="center"
                        bgRepeat="no-repeat"
                        bgSize="cover"
                        p={3}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="gray.200"
                        position="relative"
                        overflow="hidden"
                        _hover={{
                          transform: "translateY(-5px)",
                          shadow: "lg",
                        }}
                        onClick={() => handleOpenProject(project.id, project.title, project.type)}
                      >
                        <Box
                          bg="rgba(0, 0, 0, 0.6)"
                          position="absolute"
                          top="0"
                          right="0"
                          bottom="0"
                          left="0"
                          display="flex"
                          flexDirection="column"
                          justifyContent="end"
                          p={3}
                        >
                          <Text fontWeight="bold" fontSize="lg" color="white" noOfLines={1}>
                            {project.title}
                          </Text>
                          <Text fontSize="sm" color="gray.300">
                            Last edited: {new Date(project.lastEdited).toLocaleString()}
                          </Text>
                        </Box>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" p={3}>
                  <Text fontSize="lg" color="gray.600">
                    You have no projects yet.
                  </Text>
                  <Modal
                    isOpen={modalType !== ""}
                    onClose={closeModal}
                    // onConfirm={handleConfirm}
                    modalType={modalType}
                  />
                  <Menu>
                    <MenuButton
                      as={Button}
                      mt={3}
                      bgColor='purple.100'
                      _hover={{ backgroundColor: '#dcdcf6' }}
                    >
                      Create a Project
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<FiFileText />}
                        onClick={() => openModal("Doc")}
                      >
                        Doc
                      </MenuItem>
                      <MenuItem
                        icon={<FiGrid />}
                        onClick={() => openModal("Spreadsheet")}
                      >
                        Spreadsheet
                      </MenuItem>
                      <MenuItem
                        icon={<FiClipboard />}
                        onClick={() => openModal("Whiteboard")}
                      >
                        Whiteboard
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              )}


            </Flex>

            {/* Right Section: Calendar and Tasks */}
            <Flex
              direction="column"
              width={{ base: "full", lg: "40%" }}
              mr={4}
            // bg="#f6f6f6"
            >
              {/* Calendar Component */}
              <Box
                bgColor="#dcdcf6"
                p={4}
                shadow="xl"
                borderWidth="1px"
                borderRadius="2xl"
                mb={8}
                m={4}
                // my={6}
                width="full" // Full width of the parent container
                // overflow='hidden'
                height="auto"
              >
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  height='auto'
                  initialView="dayGridMonth"
                  headerToolbar={{
                    start: 'title',
                    end: 'prevYear,prev,next,nextYear'
                  }}
                  events={todaysEvents}
                />
              </Box>

              {/* Tasks Component */}
              <Box
                bg="#dcdcf6"
                p={4}
                shadow="xl"
                borderWidth="1px"
                borderRadius="2xl"
                mb={8}
                m={4}
                width="full"
                height="auto"
                overflowY="auto"
              >
                {todaysEvents && todaysEvents.length > 0 ? (
                  <Table variant="simple" colorScheme="purple">
                    <Thead>
                      <Tr>
                        <Th colSpan={4} textAlign="center" fontWeight={700}>
                          Events for today
                        </Th>
                      </Tr>
                      <Tr>
                        <Th>Title</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Priority</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{renderEventRows(todaysEvents)}</Tbody>
                  </Table>
                ) : (
                  <Text textAlign="center" mt={4}>
                    No events for today.
                  </Text>
                )}
              </Box>

            </Flex>
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
