// import { Flex, Text, Badge, Stack, Avatar, Button } from "@chakra-ui/react";
// import { auth } from "../../firebase-config";
// import { UseUserProfilePic } from "../../hooks/UseUserProfilePic";

// const Profile = () => {
//   const teams = [
//     { name: "Group Name", members: 3, description: "Description" },
//     { name: "Group Name", members: 4, description: "Description" },
//     // ... more teams
//   ];

//   const communities = [
//     { name: "Group Name", members: 3, description: "Description" },
//     { name: "Group Name", members: 4, description: "Description" },
//     // ... more communities
//   ];

//   const userProfile = UseUserProfilePic();

//   return (
//     <div>
//       <Flex
//         justifyContent="space-between"
//         alignItems="center"
//         p={5}
//         bg="#dcdcf6"
//         rounded={15}
//       >
//         <Flex align="center" p={3}>
//           <Avatar ml={3} src={userProfile.photoURL || 'fallback_image_url'} name={userProfile.displayName} />
//           <Text fontSize="25" ml={8}>
//             {auth.currentUser?.displayName}
//           </Text>
//         </Flex>

//         <Stack direction="row" spacing={4}>
//           <Badge
//             fontSize="1em"
//             p={2}
//             bg="#8587bf"
//             color="white"
//             borderRadius="md"
//           >
//             7 Projects
//           </Badge>
//           <Badge
//             fontSize="1em"
//             p={2}
//             bg="#8587bf"
//             color="white"
//             borderRadius="md"
//           >
//             11 Communities
//           </Badge>
//           <Badge
//             fontSize="1em"
//             p={2}
//             bg="#8587bf"
//             color="white"
//             borderRadius="md"
//           >
//             4 Awards
//           </Badge>
//         </Stack>

//         <Button colorScheme="purple">Leaderboard</Button>
//       </Flex>
//       <Flex direction="column" p={5}>
//         {/* <DashboardSection title="Your Teams" items={teams} />
//         <DashboardSection title="Your Communities" items={communities} /> */}
//       </Flex>
//     </div>
//   );
// };

// export default Profile;

import React, { useState } from "react";
import {
  Flex,
  Text,
  Badge,
  Stack,
  Avatar,
  Button,
  Box,
  Divider,
} from "@chakra-ui/react";
import { auth } from "../../firebase-config";
import { UseUserProfilePic } from "../../hooks/UseUserProfilePic";
import "./Profile.scss"; // Make sure this path is correct
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "./sidebar";

const Profile: React.FC = () => {
  const userProfile = UseUserProfilePic();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
                <Box className="profile-text">
                  <Text className="profile-name">
                    {userProfile.displayName || auth.currentUser?.displayName}
                  </Text>
                  <Text className="profile-description">
                    {/* {userProfile.desc || "Description"} */}
                    <p>Description</p>
                  </Text>
                </Box>
              </Flex>

              <Stack className="profile-stats">
                <Badge className="badge">7 Projects</Badge>
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
