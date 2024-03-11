import React, { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Box,
  Text,
  Stack,
  Badge,
  Divider,
  Button,
} from "@chakra-ui/react";
import { db } from "../../firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  DocumentData,
  DocumentReference,
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./CDetails.scss"; // Import the SCSS file
import { IoChatbubblesSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Social/sideBar";
import Posts from "./Posts"; // Import the Posts component
import "./Posts.scss"; // Import the CSS file for post styling
import PostModal from "./PostModal";

const CommunityDetails: React.FC = () => {
  const [communityDetails, setCommunityDetails] = useState<DocumentData | null>(
    null
  );
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);

  const handleCreatePostClick = () => {
    setCreatePostModalOpen(true);
  };

  const handleCloseCreatePostModal = () => {
    setCreatePostModalOpen(false);
  };

  let { community_id } = useParams();
  const navigate = useNavigate();

  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (community_id) {
    community_id = decodeURIComponent(community_id);
  }

  const handleChatClick = (communityId: string) => {
    navigate(`/In_communities/chat/${encodeURIComponent(communityId)}`);
  };

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        if (community_id) {
          const communityDocRef: DocumentReference<DocumentData> = doc(
            db,
            "communities",
            community_id
          );
          const communityDocSnapshot = await getDoc(communityDocRef);

          if (communityDocSnapshot.exists()) {
            setCommunityDetails(communityDocSnapshot.data());
          }
        }
      } catch (error) {
        console.error("Error fetching community details:", error);
      }
    };

    fetchCommunityDetails();
  }, [community_id]);

  // Fetch community posts
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        if (community_id) {
          const firestoreDB = db as Firestore;

          const communityPostsRef = collection(firestoreDB, "communityPosts");
          const q = query(communityPostsRef, where("Cid", "==", community_id));
          const snapshot = await getDocs(q);

          const postsData = snapshot.docs.map((doc) => doc.data());
          setCommunityPosts(postsData);
        }
      } catch (error) {
        console.error("Error fetching community posts:", error);
      }
    };

    fetchCommunityPosts();
  }, [community_id]);

  // Function to handle liking a post
  const handleLike = async (postId: string) => {
    const updatedPosts = communityPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, like: post.like + 1 };
      }
      return post;
    });
    setCommunityPosts(updatedPosts);

    try {
      const postRef = doc(db, "communityPosts", postId);
      await setDoc(
        postRef,
        { like: updatedPosts.find((post) => post.id === postId)?.like },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  // Function to handle disliking a post
  const handleDislike = async (postId: string) => {
    const updatedPosts = communityPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, like: post.like - 1 };
      }
      return post;
    });
    setCommunityPosts(updatedPosts);

    try {
      const postRef = doc(db, "communityPosts", postId);
      await setDoc(
        postRef,
        { like: updatedPosts.find((post) => post.id === postId)?.like },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

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
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          <div className="community-details-container">
            {communityDetails ? (
              <div className="profile-container">
                <Flex className="profile-header">
                  <Flex className="profile-info">
                    <Avatar
                      className="profile-avatar"
                      src={communityDetails.image || "fallback_image_url"}
                      name={communityDetails.name}
                      borderRadius="10%" // Adjust this value as needed
                    />
                    <Box className="profile-text">
                      <Text className="profile-name">
                        {communityDetails.name}
                      </Text>
                      <Text className="profile-description">
                        {communityDetails.description || "Your Description"}
                      </Text>
                    </Box>
                  </Flex>

                  <Stack className="profile-stats">
                    <Badge className="badge">0 Posts</Badge>
                    <Badge className="badge">
                      {communityDetails.members.length + 1} Members
                    </Badge>
                    <Badge className="badge">0 Awards</Badge>
                  </Stack>
                </Flex>
                <Flex className="profile-body">
                  <Flex className="top-titles">
                    <Text fontSize="xl" fontWeight="bold" mb="4" mt="2">
                      Latest Posts
                    </Text>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      ml="2"
                      onClick={handleCreatePostClick}
                    >
                      Create a Post
                    </Button>
                  </Flex>

                  <PostModal
                    isOpen={isCreatePostModalOpen}
                    onClose={handleCloseCreatePostModal}
                    Cid={community_id ? community_id : "null"}
                  />

                  <div className="posts-container">
                    {communityPosts
                      .slice()
                      .reverse()
                      .map((post, index) => (
                        <Posts
                          key={index}
                          post={post}
                          onLike={handleLike} // Pass onLike function to Posts component
                          onDislike={handleDislike} // Pass onDislike function to Posts component
                        />
                      ))}
                  </div>
                </Flex>
              </div>
            ) : (
              <p>Loading community details..</p>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CommunityDetails;
