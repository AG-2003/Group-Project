import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  Modal,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../Dashboard/Navbar";
import SideBar from "../Social/sideBar";
import { db, auth } from "../../firebase-config"; // Import Firebase Firestore instance
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./SavedPosts.scss";
import SavedPostItem from "./SavedPostItem";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string | null;
  Cid: string;
  Uid: string;
  Uname: string;
  Upic: string;
  date: string;
  communityName: string;
  communityImage: string;
  timeAgo: string;
}

interface SavedPost {
  id: string;
  name: string;
  starred: boolean;
}

interface Community {
  id: string;
  name: string;
  description: string;
  status: string;
  members: string[];
  image: string | null;
}

const SavedPosts: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<SavedPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // State to hold filtered posts
  const [filterValue, setFilterValue] = useState("");
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  const sidebarVariantsMobile = {
    open: { width: "100%" },
    closed: { width: "0px" },
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleUnsavePost = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userDocRef = doc(db, "users", user.email || "");
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        let savedPosts = [...(userDocSnapshot.data()?.savedPosts || [])]; // Clone the array
        savedPosts = savedPosts.filter(
          (savedPostId: string) => savedPostId !== postId
        );

        await updateDoc(userDocRef, { savedPosts });

        // Filter the post from the savedPosts state array while maintaining the structure
        const updatedSavedPosts = savedPosts.filter(
          (post: { id: string }) => post.id !== postId
        );
        setSavedPosts(updatedSavedPosts); // Update state to reflect changes
      }

      window.location.reload();
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };
  // Function to fetch joined communities
  const fetchJoinedCommunities = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userDocRef = doc(db, "users", user.email || "");
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const joinedCommunities =
          userDocSnapshot.data()?.joinedCommunities || [];
        setJoinedCommunities(joinedCommunities);
      }
    } catch (error) {
      console.error("Error fetching joined communities:", error);
    }
  };

  useEffect(() => {
    fetchJoinedCommunities();
  }, []);

  // Function to fetch saved posts
  const fetchSavedPosts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userDocRef = doc(db, "users", user.email || "");
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const savedPostIds = userDocSnapshot.data()?.savedPosts || [];

        // Fetch details of each saved post and its associated community
        const postsPromises = savedPostIds.map(async (postId: string) => {
          const postDocRef = doc(db, "communityPosts", postId);
          const postDocSnapshot = await getDoc(postDocRef);
          if (postDocSnapshot.exists()) {
            const postData = postDocSnapshot.data() as Post;

            // Calculate timeAgo for each post
            const now = new Date();
            const postDate = new Date(postData.date);
            const diff = now.getTime() - postDate.getTime();
            const seconds = Math.floor(diff / 1000);
            if (seconds < 60) {
              postData.timeAgo = `${seconds} second${
                seconds !== 1 ? "s" : ""
              } ago`;
            } else if (seconds < 3600) {
              const minutes = Math.floor(seconds / 60);
              postData.timeAgo = `${minutes} minute${
                minutes !== 1 ? "s" : ""
              } ago`;
            } else if (seconds < 86400) {
              const hours = Math.floor(seconds / 3600);
              postData.timeAgo = `${hours} hour${hours !== 1 ? "s" : ""} ago`;
            } else if (seconds < 2592000) {
              const days = Math.floor(seconds / 86400);
              postData.timeAgo = `${days} day${days !== 1 ? "s" : ""} ago`;
            } else if (seconds < 31536000) {
              const months = Math.floor(seconds / 2592000);
              postData.timeAgo = `${months} month${
                months !== 1 ? "s" : ""
              } ago`;
            } else {
              const years = Math.floor(seconds / 31536000);
              postData.timeAgo = `${years} year${years !== 1 ? "s" : ""} ago`;
            }

            // Fetch community details using the community ID (Cid)
            const communityDocRef = doc(db, "communities", postData.Cid);
            const communityDocSnapshot = await getDoc(communityDocRef);
            if (communityDocSnapshot.exists()) {
              const communityData = communityDocSnapshot.data() as Community;
              return {
                ...postData,
                communityName: communityData.name,
                communityImage: communityData.image,
              };
            }
          }
          return null;
        });

        const postsData = await Promise.all(postsPromises);
        const validPostsData = postsData.filter((post) => post !== null);
        setSavedPosts(validPostsData as Post[]);
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  useEffect(() => {
    const filtered = savedPosts.filter((post) =>
      (post.title || "").toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [filterValue, savedPosts]);

  const navigateToPost = (postId: string, communityId: string) => {
    navigate(`/communities/in_communities/${communityId}`);

    // Find the post element by its ID
    const postElement = document.getElementById(`post-${postId}`);

    // If the post element is found, scroll to it
    if (postElement) {
      const yOffset = -100; // Adjust this value if necessary to ensure the post is not hidden behind any fixed elements
      const y =
        postElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const renderSavedPosts = () => {
    if (filteredPosts.length === 0) {
      return <Text>You have no saved posts</Text>;
    } else {
      return (
        <>
          {filteredPosts.map((post, index) => (
            <SavedPostItem
              key={`${post.id}-${index}`}
              post={post}
              handleUnsavePost={handleUnsavePost}
              navigateToPost={navigateToPost}
            />
          ))}
        </>
      );
    }
  };

  return (
    <div style={{position: "fixed", width: '100%'}}>
        <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)">
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
              <SideBar
                onNavigate={(arg: string) => {
                  console.log(arg);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial="closed"
              animate="closed"
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
              <SideBar
                onNavigate={(arg: string) => {
                  console.log(arg);
                }}
              />
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
              }}
            >
              <SideBar
                onNavigate={(arg: string) => {
                  console.log(arg);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial="closed"
              animate="closed"
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
                onNavigate={(arg: string) => {
                  console.log(arg);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          <Flex direction="column" alignItems="flex-start">
            <Flex justify="space-between" width="100%" marginBottom="20px">
              <Input
                type="text"
                placeholder="Filter Posts..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </Flex>
            <Flex
              direction="column"
              width="100%"
              className="saved-posts-container"
            >
              <Text fontSize="lg" fontWeight="bold" marginBottom="10px">
                Saved Posts
              </Text>
              {renderSavedPosts()}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default SavedPosts;
