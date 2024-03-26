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
          <Flex
            className="containerTeams"
            direction="column"
            marginLeft={5}
            marginTop={3}
          >
            <Flex className="profile-body" justify="center">
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
    </>
  );
};

export default AllPosts;
