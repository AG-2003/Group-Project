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
  Input,
  Image,
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
import SideBar from "../components/Dashboard/sidebar";
import { FaShare } from "react-icons/fa6";
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

const posts = [
  {
    id: 1,
    communityName: "Community 1",
    userName: "User 1",
    postTitle: "Post Title 1",
    postContent: "https://via.placeholder.com/300",
    likes: 10,
    dislikes: 2,
    comments: 5,
  },
  {
    id: 2,
    communityName: "Community 2",
    userName: "User 2",
    postTitle: "Post Title 2",
    postContent: "https://via.placeholder.com/300",
    likes: 20,
    dislikes: 5,
    comments: 8,
  },
];

const communities = [
  { id: 1, name: "Community 1", img: "https://via.placeholder.com/50" },
  { id: 2, name: "Community 2", img: "https://via.placeholder.com/50" },
];

const Social = () => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
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
          {/* <div style={{ marginTop: "60px" }}>
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
          */}

          <Flex>
            {/* Sidebar with communities */}
            <motion.div
              initial={{ width: "25%" }}
              animate={{ width: "25%" }}
              transition={{ type: "spring", duration: 0.5 }}
              style={{
                backgroundColor: "#f6f6f6",
                height: "100vh",
                overflowY: "scroll",
              }}
            >
              <Box p="4">
                <Input placeholder="Search" mb="4" />
                {communities.map((community) => (
                  <Flex key={community.id} alignItems="center" mb="2">
                    <Avatar src={community.img} mr="2" />
                    <Text>{community.name}</Text>
                    <Button ml="auto" variant="ghost" size="sm">
                      {/* Star button to favorite */}★
                    </Button>
                  </Flex>
                ))}
              </Box>
            </motion.div>

            {/* Posts */}
            <Box p="4" w="75%" borderLeft="1px solid #ccc" overflowY="scroll">
              {posts.map((post) => (
                <Box key={post.id} mb="4">
                  {/* Header */}
                  <Flex alignItems="center" mb="2">
                    <Text fontSize="sm" mr="2">
                      {post.communityName}
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" mr="2">
                      {post.userName}
                    </Text>
                    <Text fontSize="sm">{`${post.likes} likes • ${post.dislikes} dislikes • ${post.comments} comments`}</Text>
                    <Text fontSize="sm" ml="auto">
                      2 hours ago
                    </Text>
                  </Flex>

                  {/* Post Content */}
                  <Box mb="2">
                    <Text fontWeight="bold">{post.postTitle}</Text>
                    <Image src={post.postContent} alt="Post" mt="2" />
                  </Box>

                  {/* Action Buttons */}
                  <Flex alignItems="center">
                    <Button variant="ghost" size="sm" mr="2">
                      <FaRegThumbsUp />
                    </Button>
                    <Button variant="ghost" size="sm" mr="2">
                      <FaRegThumbsDown />
                    </Button>
                    <Button variant="ghost" size="sm" mr="2">
                      <FaRegComment />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FaShare />
                    </Button>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Social;
