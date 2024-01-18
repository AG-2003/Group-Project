// import { Box, Flex, Heading, Divider, Button } from "@chakra-ui/react";
// import { motion } from "framer-motion";
// import { FaPaperPlane } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const QuickChat = () => {
//   const navigate = useNavigate();

//   return (
//     <Flex flexDirection="column" height="100vh">
//       {/* Header */}
//       <Flex
//         bg="blue.500"
//         color="white"
//         p={4}
//         align="center"
//         justify="space-between"
//       >
//         <Box>
//           <Heading as="h2" size="xl">
//             Chats
//           </Heading>
//         </Box>
//         <Button
//           colorScheme="whiteAlpha"
//           variant="link"
//           onClick={() => {
//             navigate(-1);
//           }}
//           marginRight={5}
//           _hover={{ color: "white" }}
//         >
//           Go Back
//         </Button>
//       </Flex>

//       {/* Body - List of people on the left and chats on the right */}
//       <Flex flex="1">
//         {/* List of people on the left (25% of the screen) */}
//         <motion.div
//           style={{
//             width: "25%",
//             background: "grey.300",
//             padding: 4,
//             borderRadius: "lg",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Heading size="md" textAlign="center">
//             You don't have any friends
//           </Heading>
//           <Button mt={4} colorScheme="blue">
//             Add Friends
//           </Button>
//         </motion.div>

//         {/* Divider between left and right sections */}
//         <Divider orientation="vertical" mx={0} borderColor="gray.300" />

//         {/* Chats on the right (75% of the screen) */}
//         <motion.div
//           style={{
//             flex: "1",
//             borderRadius: "lg",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "white",
//             padding: 4,
//             marginLeft: 2,
//           }}
//         >
//           {/* Content of the right section */}
//           <Box textAlign="center">
//             {/* Centered div for the paper plane icon inside a circle */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "50%", // Make it a circle
//                 width: "80px", // Set the width and height as needed
//                 height: "80px",
//                 background: "#555", // Background color of the circle
//                 marginLeft: 149,
//               }}
//             >
//               <FaPaperPlane size={40} color="#fff" />
//             </div>
//             <Heading size="md" mt={4}>
//               Your messages
//             </Heading>
//             <Box mt={2}>
//               Send posts, photos, and videos to a friend or a group.
//             </Box>
//           </Box>
//         </motion.div>
//       </Flex>
//     </Flex>
//   );
// };

// export default QuickChat;

import React from "react";
import Sidebar from "../components/Chats/Sidebar";
import Chatbox from "../components/Chats/Chat";
import "./Chat.scss";

const Chat = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chatbox />
      </div>
    </div>
  );
};

export default Chat;
