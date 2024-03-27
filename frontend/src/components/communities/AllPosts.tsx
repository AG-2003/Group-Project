import React, { useState, useEffect } from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Social/sideBar";
import Navbar from "../Dashboard/Navbar";
import { auth, db } from "../../firebase-config"; // Import Firebase Firestore instance
import {
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Posts from "./Posts";
import "./Posts.scss";
import "./CDetails.scss";

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

const AllPosts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [wasManuallyClosed, setWasManuallyClosed] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await auth.currentUser;
      if (user) {
        setUserId(user?.email || "");
      }
    };

    fetchUserId();
  }, []);


  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);

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

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        // Fetch all community posts
        const communityPostsQuery = query(
          collection(db, "communityPosts"),
          orderBy("date", "desc")
        );
        const communityPostsSnapshot = await getDocs(communityPostsQuery);
        const communityPostsData = communityPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setAllPosts(communityPostsData);
      } catch (error) {
        console.error("Error fetching all posts:", error);
      }
    };

    fetchAllPosts();
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

  // Function to handle liking a post
  const handleLike = async (postId: string, userId: string) => {
    try {
      const postRef = doc(db, "communityPosts", postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        let likedBy = postDoc.data()?.likedBy || [];
        let dislikedBy = postDoc.data()?.dislikedBy || [];

        // Check if user already liked the post
        if (!likedBy.includes(userId)) {
          // Add user to likedBy array
          likedBy.push(userId);

          // Remove user from dislikedBy array if already disliked
          dislikedBy = dislikedBy.filter((id: string) => id !== userId);

          // Update post document
          await updateDoc(postRef, {
            likedBy,
            dislikedBy,
          });
        } else {
          // Remove user from likedBy array
          likedBy = likedBy.filter((id: string) => id !== userId);

          // Update post document
          await updateDoc(postRef, {
            likedBy,
          });
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Function to handle disliking a post
  const handleDislike = async (postId: string, userId: string) => {
    try {
      const postRef = doc(db, "communityPosts", postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        let likedBy = postDoc.data()?.likedBy || [];
        let dislikedBy = postDoc.data()?.dislikedBy || [];

        // Check if user already disliked the post
        if (!dislikedBy.includes(userId)) {
          // Add user to dislikedBy array
          dislikedBy.push(userId);

          // Remove user from likedBy array if already liked
          likedBy = likedBy.filter((id: string) => id !== userId);

          // Update post document
          await updateDoc(postRef, {
            likedBy,
            dislikedBy,
          });
        } else {
          // Remove user from dislikedBy array
          dislikedBy = dislikedBy.filter((id: string) => id !== userId);

          // Update post document
          await updateDoc(postRef, {
            dislikedBy,
          });
        }
      }
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };

  // Function to handle deleting a post
  const handleDeletePost = async (postId: string, postUid: string) => {
    try {
      const user = auth.currentUser;
      if (user && user.email === postUid) {
        // Check if current user is the owner of the post
        const postRef = doc(db, "communityPosts", postId);
        await deleteDoc(postRef);

        // Remove the deleted post from state
        setAllPosts(allPosts.filter((post) => post.id !== postId));

        // Update the user document to remove the deleted post from the posts array
        const userDocRef = doc(db, "users", user.email || "");
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData) {
            const updatedCommunityPosts = userData.posts.filter(
              (id: string) => id !== postId
            );
            await updateDoc(userDocRef, {
              posts: updatedCommunityPosts,
            });
          }
        }
      } else {
        console.error("User is not authorized to delete this post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  // Function to save a post
  const savePost = async (postId: string) => {
    try {
      // Ensure user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Retrieve user document from Firestore
      const userDocRef = doc(db, "users", user.email || "");
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Get user's saved posts array or initialize empty array
        const savedPosts = userDocSnapshot.data()?.savedPosts || [];

        // Check if post is already saved
        if (savedPosts.includes(postId)) {
          console.log("Post already saved");
          return;
        }

        // Add postId to saved posts array
        savedPosts.push(postId);

        // Update user document in Firestore with updated saved posts array
        await updateDoc(userDocRef, {
          savedPosts: savedPosts,
        });

        console.log("Post saved successfully");
      } else {
        throw new Error("User document not found");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const editPost = async (
    postId: string,
    newTitle: string,
    newDescription: string
  ) => {
    try {
      // Ensure user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Retrieve post document from Firestore
      const postRef = doc(db, "communityPosts", postId);
      const postDocSnapshot = await getDoc(postRef);

      if (postDocSnapshot.exists()) {
        // Check if current user is the owner of the post

        if (postDocSnapshot.data()?.Uid === user.email) {
          // Update post document in Firestore with new title and description
          await updateDoc(postRef, {
            title: newTitle,
            description: newDescription,
          });

          console.log("Post updated successfully");
        } else {
          console.error("User is not authorized to edit this post.");
        }
      } else {
        console.error("Post document not found");
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  return (
    <div style={{ position: "fixed", width: '100%' }}>
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
                onNavigate={function (arg: string): void {
                  throw new Error("Function not implemented.");
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
                onNavigate={function (arg: string): void {
                  throw new Error("Function not implemented.");
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
                flexShrink: "0",
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
                flexShrink: "0",
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
      )}
        <Box
          flexGrow={1}
          padding="10px"
          marginLeft={5}
          overflowY="scroll"
          overflowX="hidden"
          marginBottom={10}
          sx={{
                '&::-webkit-scrollbar': {
                  width: '10px',
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-button': {
                  display: 'none', 
                },
                '&:hover::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                },
                '&:hover': {
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0, 0, 0, 0.5) transparent', 
                },
            }}
        >
          <Flex
            className="containerTeams"
            direction="column"
            marginLeft={0}
            marginTop={3}
            height="100vh"
          >
            <Flex
              className="profile-body"
              justify="center"
              padding="0px"
            >
              <div className="posts-container">
                {allPosts.map((post, index) => (
                  <Posts
                    key={index}
                    post={post}
                    userId={userId}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    deletePost={handleDeletePost}
                    savePost={savePost}
                    editPost={editPost}
                    admin={false}
                  />
                ))}
              </div>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default AllPosts;
