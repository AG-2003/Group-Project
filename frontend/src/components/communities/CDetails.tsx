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
import { auth, db } from "../../firebase-config";
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
  updateDoc,
  deleteDoc,
  orderBy,
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
import { SettingsIcon } from "@chakra-ui/icons";
import LeaderboardModal from "./LeaderboardModal";

const CommunityDetails: React.FC = () => {
  const [communityDetails, setCommunityDetails] = useState<DocumentData | null>(
    null
  );
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [leaderboardData, setLeaderboardData] = useState<
    { userId: string; displayName: string; likes: number }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);

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

  // Fetch userID
  useEffect(() => {
    const fetchUserId = async () => {
      const user = await auth.currentUser;
      if (user) {
        setUserId(user?.email || "");
      }
    };

    fetchUserId();
  }, []);

  // Fetch community
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
          const q = query(
            communityPostsRef,
            where("Cid", "==", community_id),
            orderBy("date", "desc") // Order posts by date in descending order
          );
          const snapshot = await getDocs(q);

          const postsData = snapshot.docs.map((doc) => doc.data());
          setCommunityPosts(postsData.reverse()); // Reverse the order of the posts
        }
      } catch (error) {
        console.error("Error fetching community posts:", error);
      }
    };

    fetchCommunityPosts();
  }, [community_id]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const postsQuery = query(
          collection(db, "communityPosts"),
          where("Cid", "==", community_id)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const repliesQuery = query(
          collection(db, "communityReplies"),
          where("Cid", "==", community_id)
        );
        const repliesSnapshot = await getDocs(repliesQuery);

        const usersLikes: { [userId: string]: number } = {};

        postsSnapshot.forEach((postDoc) => {
          const { Uid, likedBy, dislikedBy } = postDoc.data();
          usersLikes[Uid] =
            (usersLikes[Uid] || 0) + (likedBy.length - dislikedBy.length);
        });

        repliesSnapshot.forEach((replyDoc) => {
          const { Uid, likedBy, dislikedBy } = replyDoc.data();
          usersLikes[Uid] =
            (usersLikes[Uid] || 0) + (likedBy.length - dislikedBy.length);
        });

        const leaderboardPromises = Object.keys(usersLikes).map(
          async (userId) => {
            try {
              const userDocRef = doc(db, "users", userId);
              const userDocSnapshot = await getDoc(userDocRef);
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                if (userData) {
                  const displayName = userData.displayName || "Unknown"; // Replace "Unknown" with a default value if display name is not available
                  return {
                    userId,
                    displayName,
                    likes: usersLikes[userId],
                  };
                }
              }
            } catch (error) {
              console.error(
                `Error fetching user data for userId ${userId}:`,
                error
              );
            }
            return null;
          }
        );

        const leaderboardData = await Promise.all(leaderboardPromises);
        const filteredLeaderboardData = leaderboardData.filter(
          (data) => data !== null
        ) as { userId: string; displayName: string; likes: number }[];

        const sortedLeaderboard = filteredLeaderboardData.sort(
          (a, b) => b.likes - a.likes
        );

        setLeaderboardData(sortedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, [community_id]);

  const openLeaderboardModal = () => {
    setIsOpen(true);
  };

  const closeLeaderboardModal = () => {
    setIsOpen(false);
  };

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
        setCommunityPosts(communityPosts.filter((post) => post.id !== postId));

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

          window.location.reload();
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
                      borderRadius="10%"
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
                    <Badge className="badge">
                      {communityPosts.length} Posts
                    </Badge>
                    <Badge className="badge">
                      {communityDetails.members.length || 0} Members
                    </Badge>
                    <Button
                      className="leaderboard-button"
                      onClick={openLeaderboardModal} // Open the leaderboard modal on button click
                    >
                      Leaderboard
                    </Button>

                    <LeaderboardModal
                      isOpen={isOpen}
                      onClose={closeLeaderboardModal}
                      leaderboardData={leaderboardData}
                    />

                    {communityDetails.members.includes(userId) && (
                      <Button
                        colorScheme="gray"
                        size="sm"
                        ml="2"
                        leftIcon={<SettingsIcon />}
                        onClick={() =>
                          navigate(
                            `/communities/in_communities/${community_id}/settings`
                          )
                        }
                      />
                    )}
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
                    Uid={userId}
                  />

                  <div className="posts-container">
                    {communityPosts
                      .slice()
                      .reverse()
                      .map((post, index) => (
                        <Posts
                          key={index}
                          post={post}
                          userId={userId}
                          onLike={handleLike} // Pass onLike function to Posts component
                          onDislike={handleDislike} // Pass onDislike function to Posts component
                          deletePost={handleDeletePost}
                          savePost={savePost}
                          editPost={editPost}
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
