import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"; // Import Chakra UI components for styling
import { DocumentData } from "firebase/firestore";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import "./Posts.scss"
import CommentsModal from "./commentsModal";


interface Props {
  post: DocumentData;
  userId: string; // User ID
  onLike: (postId: string, userId: string) => void; // Callback function to handle liking
  onDislike: (postId: string, userId: string) => void; // Callback function to handle disliking
  deletePost: (postId: string, postUid: string) => void;
  savePost: (post: string) => void;
}

const Posts = ({
  post,
  userId,
  onLike,
  onDislike,
  deletePost,
  savePost,
}: Props) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [likeCount, setLikeCount] = useState(
    post.likedBy ? post.likedBy.length : 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    post.dislikedBy ? post.dislikedBy.length : 0
  );
  const [likeClicked, setLikeClicked] = useState(
    post.likedBy && post.likedBy.includes(userId)
  );
  const [dislikeClicked, setDislikeClicked] = useState(
    post.dislikedBy && post.dislikedBy.includes(userId)
  );
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const commentDate = new Date(post.date);
      const diff = now.getTime() - commentDate.getTime();
      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) {
        setTimeAgo(`${seconds} second${seconds !== 1 ? "s" : ""} ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
          setTimeAgo(`${minutes} minute${minutes !== 1 ? "s" : ""} ago`);
        } else {
          const hours = Math.floor(minutes / 60);
          if (hours < 24) {
            setTimeAgo(`${hours} hour${hours !== 1 ? "s" : ""} ago`);
          } else {
            const days = Math.floor(hours / 24);
            if (days < 30) {
              setTimeAgo(`${days} day${days !== 1 ? "s" : ""} ago`);
            } else {
              const months = Math.floor(days / 30);
              if (months < 12) {
                setTimeAgo(`${months} month${months !== 1 ? "s" : ""} ago`);
              } else {
                const years = Math.floor(months / 12);
                setTimeAgo(`${years} year${years !== 1 ? "s" : ""} ago`);
              }
            }
          }
        }
      }
    };

    calculateTimeAgo();
  }, [post.date]);

  const handleLikeClick = async () => {
    if (!likeClicked) {
      await onLike(post.id, userId); // Pass userId to the onLike callback
      setLikeClicked(true);
      setLikeCount(likeCount + 1);
      if (dislikeClicked) {
        await onDislike(post.id, userId); // Pass userId to the onDislike callback
        setDislikeClicked(false);
        setDislikeCount(dislikeCount - 1);
      }
    } else {
      await onLike(post.id, userId); // Pass userId to the onDislike callback
      setLikeClicked(false);
      setLikeCount(likeCount - 1);
    }
  };

  const handleDislikeClick = async () => {
    if (!dislikeClicked) {
      await onDislike(post.id, userId); // Pass userId to the onDislike callback
      setDislikeClicked(true);
      setDislikeCount(dislikeCount + 1);
      if (likeClicked) {
        await onLike(post.id, userId); // Pass userId to the onLike callback
        setLikeClicked(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      await onDislike(post.id, userId); // Pass userId to the onLike callback
      setDislikeClicked(false);
      setDislikeCount(dislikeCount - 1);
    }
  };

  const handleShareClick = () => {
    // Logic to share the post link
    console.log("Share clicked");
  };

  const handleCommentsClick = () => {
    setIsCommentsModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentsModalOpen(false);
  };

  const handlePostDelete = async () => {
    deletePost(post.id, post.Uid);
  };

  const handleSave = async () => {
    savePost(post.id);
  };

  // return (
  //   <Box>
  //     <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
  //       {/* Display post image if available, otherwise display a placeholder */}
  //       {post.image ? (
  //         <img
  //           src={post.image}
  //           alt=""
  //           style={{
  //             width: "100%",
  //             height: "300px",
  //             objectFit: "cover",
  //             marginBottom: "1rem",
  //           }}
  //         />
  //       ) : (
  //         <Box
  //           bg="gray.200"
  //           w="100%"
  //           h="300px" // Adjust the height of the square as needed
  //           mb="4"
  //         />
  //       )}
  //       <Text fontSize="lg" fontWeight="bold" mb="2">
  //         {post.title}
  //       </Text>
  //       <Text fontSize="sm" color="gray.500" mb="2">
  //         Date Posted: {post.date}
  //       </Text>
  //       <Text>{post.description}</Text>
  //       {/* Like and Dislike buttons with counters */}
  //       <Flex align="center" mt="2">
  //         <Button
  //           colorScheme={likeClicked ? "green" : "gray"}
  //           size="sm"
  //           mr="2"
  //           onClick={handleLikeClick}
  //           isDisabled={dislikeClicked}
  //         >
  //           Like
  //         </Button>
  //         <Text fontSize="sm" mr="2">
  //           {post.like}
  //         </Text>
  //         <Button
  //           colorScheme={dislikeClicked ? "red" : "gray"}
  //           size="sm"
  //           mr="2"
  //           onClick={handleDislikeClick}
  //           isDisabled={likeClicked}
  //         >
  //           Dislike
  //         </Button>
  //         <Button
  //           colorScheme="blue"
  //           size="sm"
  //           mr="2"
  //           onClick={handleShareClick}
  //         >
  //           Share
  //         </Button>
  //         <Button size="sm" onClick={handleCommentsClick}>
  //           <Box as="span" mr="1">
  //             <Text as="span">{post.commentsCount || 0}</Text>{" "}
  //           </Box>
  //           <Box as="span">
  //             <Text as="span">Comments</Text>
  //           </Box>
  //         </Button>
  //       </Flex>
  //     </Box>
  //   </Box>
  // );
 return (
    <Box className="post-container">
      <Box className="post-box" borderWidth="1px" borderRadius="lg" p="4" mb="4">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            className="post-image"
          />
        ) : (
          <Box
            bg="gray.200"
            w="100%"
            h="300px"
            mb="4"
            className="post-placeholder"
          />
        )}
        <Text className="post-title" fontSize="lg" fontWeight="bold" mb="2">
          {post.title}
        </Text>
        <Text className="post-date" fontSize="sm" color="gray.500" mb="2">
          Date Posted: {post.date}
        </Text>
        <Text className="post-description">{post.description}</Text>
        <Flex className="post-actions" align="center" mt="2">
          <Button
            className="like-button"
            size="sm"
            mr="2"
            onClick={handleLikeClick}
            isDisabled={dislikeClicked}
            variant="ghost" // Use the 'ghost' variant or another appropriate one
          >
            <FaRegThumbsUp color={likeClicked ? "green" : "gray"} />
          </Button>
          <Text fontSize="sm" mr="2">
            {post.like}
          </Text>
          <Button
            className="dislike-button"
            size="sm"
            mr="2"
            onClick={handleDislikeClick}
            isDisabled={likeClicked}
            variant="ghost" // Use the 'ghost' variant or another appropriate one
          >
            <FaRegThumbsDown color={dislikeClicked ? "red" : "gray"} />
          </Button>
          <Button
            className="share-button"
            // colorScheme="blue"
            size="sm"
            mr="2"
            onClick={handleShareClick}
          >
            Share
          </Button>
          <Button className="comments-button" size="sm" onClick={handleCommentsClick}>
            <Box as="span" mr="1">
              <Text as="span">{post.commentsCount || 0}</Text>
            </Box>
            <Box as="span">
              <Text as="span">Comments</Text>
            </Box>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Posts;


