import {
  Flex,
  Box,
  Text,
  SimpleGrid,
  Badge,
  Stack,
  Avatar,
  Button,
  Divider,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaRegStar,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegComment,
  FaTelegramPlane,
  FaRegBookmark,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Dashboard/Navbar";
import SideBar from "../components/Social/sideBar";

const DashboardSection = (title: string, items: any) => {
  return (
    <Box mt={10}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {title}
      </Text>
      <SimpleGrid columns={4} spacing={5}>
        {items.map((item: any, index: any) => (
          <Box
            key={index}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            textAlign="center"
            bg="purple.100"
          >
            <Avatar size="xl" name={item.name} mb={4} />
            <Text fontWeight="bold">{item.name}</Text>
            <Text fontSize="sm">{item.members} Members</Text>
            <Text mt={2} fontSize="sm">
              {item.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

const Social = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDisLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [openComments, setOpenComments] = useState(false); // to open the comment section

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ position: "fixed", width: "100%"}}>
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
              <SideBar
                onNavigate={function (arg: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
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
              <SideBar
                onNavigate={function (arg: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Box flexGrow={1} padding="10px" marginLeft={5} overflowY="auto">
          <div style={{ marginTop: "60px" }}>
            {/* This div contains code to display the comment section */}
            {openComments && (
              <div
                style={{
                  backgroundColor: "rgba(128, 128, 128, 0.7)",
                  position: "fixed",
                  zIndex: 10,
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "800px",
                    height: "500px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#7f7f99",
                      height: "70px",
                      padding: "20px",
                      color: "white",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h1 style={{ fontSize: "20px", marginLeft: "10px" }}>
                      Comments
                    </h1>
                    <FaTimes
                      size="25px"
                      onClick={() => {
                        setOpenComments(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/*This Div contains the post */}
            <div style={{ width: "800px" }}>
              <div
                style={{
                  width: "840px",
                  height: "600px",
                  backgroundColor: "#dcdcf6",
                  marginBottom: "20px",
                  paddingTop: "30px",
                  paddingBottom: "30px",
                  paddingLeft: "60px",
                  paddingRight: "60px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#a3a3c2",
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                      marginRight: "8px",
                    }}
                  ></div>
                  <label
                    style={{
                      fontSize: "15px",
                      color: "#242424",
                      marginRight: "20px",
                    }}
                  >
                    Community Name
                  </label>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "#242424",
                      marginRight: "20px",
                    }}
                  >
                    Posted by username
                  </label>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "#242424",
                      marginRight: "20px",
                    }}
                  >
                    4 hours ago
                  </label>
                </div>
                <h1
                  style={{
                    fontSize: "20px",
                    marginLeft: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Post Title
                </h1>
                <div
                  style={{
                    height: "410px",
                    backgroundColor: "#7f7f99",
                    position: "relative",
                    left: 0,
                    right: 0,
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                    width: "300px",
                    marginLeft: "10px",
                  }}
                >
                  <FaRegThumbsUp
                    size="25px"
                    onClick={() => {
                      setLikes(likes + 1);
                    }}
                  />
                  <label>{likes}</label>
                  <FaRegThumbsDown
                    size="25px"
                    onClick={() => {
                      setDisLikes(dislikes + 1);
                    }}
                  />
                  <label>{dislikes}</label>
                  <FaRegComment
                    size="25px"
                    onClick={() => {
                      setOpenComments(true);
                    }}
                  />
                  <label>{comments}</label>
                  <FaTelegramPlane size="25px" />
                  <FaRegBookmark size="25px" />
                </div>
              </div>
            </div>
            <div style={{ width: "800px" }}>
              <div
                style={{
                  width: "840px",
                  height: "600px",
                  backgroundColor: "#dcdcf6",
                  marginBottom: "20px",
                  paddingTop: "30px",
                  paddingBottom: "30px",
                  paddingLeft: "60px",
                  paddingRight: "60px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#a3a3c2",
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                      marginRight: "8px",
                    }}
                  ></div>
                  <label
                    style={{
                      fontSize: "15px",
                      color: "#242424",
                      marginRight: "20px",
                    }}
                  >
                    Community Name
                  </label>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "#242424",
                      marginRight: "20px",
                    }}
                  >
                    Posted by username
                  </label>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "#242424",
                      marginRight: "20px",
                    }}
                  >
                    4 hours ago
                  </label>
                </div>
                <h1
                  style={{
                    fontSize: "20px",
                    marginLeft: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Post Title
                </h1>
                <div
                  style={{
                    height: "410px",
                    backgroundColor: "#7f7f99",
                    position: "relative",
                    left: 0,
                    right: 0,
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                    width: "300px",
                    marginLeft: "10px",
                  }}
                >
                  <FaRegThumbsUp
                    size="25px"
                    onClick={() => {
                      setLikes(likes + 1);
                    }}
                  />
                  <label>{likes}</label>
                  <FaRegThumbsDown
                    size="25px"
                    onClick={() => {
                      setDisLikes(dislikes + 1);
                    }}
                  />
                  <label>{dislikes}</label>
                  <FaRegComment
                    size="25px"
                    onClick={() => {
                      setOpenComments(true);
                    }}
                  />
                  <label>{comments}</label>
                  <FaTelegramPlane size="25px" />
                  <FaRegBookmark size="25px" />
                </div>
              </div>
            </div>
            {/* this contains code to display the filter tab */}
            <div
              style={{
                width: "320px",
                backgroundColor: "#dcdcf6",
                position: "fixed",
                top: 70,
                bottom: 10,
                right: 20,
                borderRadius: "5px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  padding: "6px",
                  backgroundColor: "#cacae8",
                  borderRadius: "30px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FaSearch size="20px" style={{ marginLeft: "6px" }} />

                <input
                  type="text"
                  placeholder="Filter"
                  style={{
                    flex: 1,
                    padding: "6px",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    marginLeft: "5px",
                  }}
                />
              </div>
              <label style={{ fontSize: "13px", color: "#242424" }}>
                YOUR COMMUNITIES
              </label>
              <div style={{ marginTop: "40px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#a3a3c2",
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                      marginRight: "8px",
                      marginLeft: "15px",
                    }}
                  ></div>
                  <label style={{ fontSize: "15px", color: "#242424" }}>
                    Community Name
                  </label>
                  <FaRegStar style={{ marginLeft: "auto" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#a3a3c2",
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                      marginRight: "8px",
                      marginLeft: "15px",
                    }}
                  ></div>
                  <label style={{ fontSize: "15px", color: "#242424" }}>
                    Community Name
                  </label>
                  <FaRegStar style={{ marginLeft: "auto" }} />
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Social;
