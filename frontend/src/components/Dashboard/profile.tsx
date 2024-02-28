import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Badge,
  Stack,
  Avatar,
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
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { SuiteData } from "../../interfaces/SuiteData";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiAward } from "react-icons/fi";

const Profile: React.FC = () => {
  const userProfile = UseUserProfilePic();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingDesc, setIsLoadingDesc] = useState<boolean>(true);

  const [user] = useAuthState(auth);
  const [totalNoOfProjects, setTotalNoOfProjects] = useState(0)

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    getTotalNoOfProjects()
  }, []);


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
          ...userWhiteboards
        ];

        combinedProjects = combinedProjects.filter(
          (project: SuiteData) => !project.isTrash
        );

        const projectNum = combinedProjects.length;

        setTotalNoOfProjects(projectNum)
      }
    }
  };
  //_____________________________________________


  return (
    <>
      <div style={{ padding: "10px", background: "#484c6c" }}>
        <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
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
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          <div className="profile-container">
            <Flex className="profile-header">
              <Flex className="profile-info">
                <Avatar
                  className="profile-avatar"
                  src={userProfile.photoURL || "fallback_image_url"}
                  name={userProfile.displayName}
                  borderRadius="10%" // Adjust this value as needed
                />
                {isLoadingDesc ? (<Spinner ml='2rem' />) :
                  <Box className="profile-text">
                    <ChakraLink as={ReactRouterLink} to='/settings' className="profile-name">
                      {(userProfile.displayName || auth.currentUser?.displayName) || 'Set username here'}
                    </ChakraLink>
                    <ChakraLink as={ReactRouterLink} to='/settings' className="profile-description">
                      {userDescription}
                    </ChakraLink>
                  </Box>}

              </Flex>

              <Stack className="profile-stats">
                <Badge className="badge">{totalNoOfProjects} Projects</Badge>
                <Badge className="badge">11 Communities</Badge>
                <Badge className="badge">4 Awards</Badge>
              </Stack>

              <Button className="leaderboard-button">Leaderboard</Button>
            </Flex>
            <Flex className="profile-body">
              {/* The commented out sections can be replaced with your components */}
              {/* <DashboardSection title="Your Teams" items={teams} />
        <DashboardSection title="Your Communities" items={communities} /> */}
            </Flex>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
