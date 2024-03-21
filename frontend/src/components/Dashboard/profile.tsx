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
} from "@chakra-ui/react";
import { auth, db } from "../../firebase-config";
import { UseUserProfilePic } from "../../hooks/UseUserProfilePic";
import "./Profile.scss"; // Make sure this path is correct
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "./sidebar";
import { doc, getDoc } from "firebase/firestore";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { SuiteData } from "../../interfaces/SuiteData";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiAward } from "react-icons/fi";
import { BadgesType } from "../../interfaces/BadgesType";

// Define an interface for the props if you're using TypeScript
interface StatCardProps {
  title: string;
  value: number | string;
}

// Card component for individual stats
const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <Box
      bg="white"
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

  const sidebarVariants = {
    open: { width: "200px" },
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

  return (
    <>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)">
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
              }}
            >
              <SideBar />
            </motion.div>
          )}
        </AnimatePresence>
        <Box width="full" m={4}>
          {/* User Info Box */}{" "}
          {/* <Heading size="sm" mb={3} p={4} pl={4}>
            Dashboard
          </Heading> */}
          <Flex justify="center">
            {" "}
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
                  fontSize="lg"
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
                <StatCard title="Communities" value="11" />
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

              {/* Recent designs */}
              <Heading size="sm" mb={3} pl={4} pt={4}>
                Recent Designs
              </Heading>
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
                bg="blue.100"
                p={12}
                shadow="xl"
                borderWidth="1px"
                borderRadius="2xl"
                mb={8}
                m={4}
                // my={6}
                width="full" // Full width of the parent container
                height="200px"
              >
                {/* Calendar content */}
              </Box>

              {/* Tasks Component */}
              <Box
                bg="orange.100"
                p={12}
                shadow="xl"
                borderWidth="1px"
                borderRadius="2xl"
                mb={8}
                m={4}
                width="full"
                height="200px"
              >
                {/* Tasks content */}
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
