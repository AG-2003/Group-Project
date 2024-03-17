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

  return (
    <Box>
      <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
        <Flex justify="space-between" align="center" mb="2">
          <Flex align="center">
            <Avatar size="sm" name={post.Uname} src={post.Upic} mr="2" />
            <Text fontSize="sm">{post.Uname}</Text>
          </Flex>
          <Text fontSize="sm" color="gray.500" mb="2">
            {timeAgo}
          </Text>
          <Menu>
            <MenuButton as={Button} size="sm" variant="ghost" color="gray.500">
              ...
            </MenuButton>
            <MenuList>
              {post.Uid === userId && (
                <MenuItem onClick={handlePostDelete}>Delete</MenuItem>
              )}
              <MenuItem onClick={handleSave}>Save</MenuItem>
              <MenuItem color="red">Report</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Text fontSize="lg" fontWeight="bold" mb="2">
          {post.title}
        </Text>
        {post.image ? (
          <img
            src={post.image}
            alt=""
            style={{
              width: "400px",
              height: "300px",
              objectFit: "cover",
              marginBottom: "1rem",
            }}
          />
        ) : (
          <Box bg="gray.200" w="100%" h="300px" mb="4" />
        )}

        <Text>{post.description}</Text>
        {/* Like and Dislike buttons */}
        <Flex align="center" mt="2">
          <Button
            colorScheme={likeClicked ? "green" : "gray"}
            size="sm"
            mr="2"
            onClick={handleLikeClick}
            isDisabled={dislikeClicked}
          >
            Like
          </Button>
          <Text fontSize="sm" mr="2">
            {likeCount - dislikeCount}
          </Text>
          <Button
            colorScheme={dislikeClicked ? "red" : "gray"}
            size="sm"
            mr="2"
            onClick={handleDislikeClick}
            isDisabled={likeClicked}
          >
            Dislike
          </Button>
          <Button
            colorScheme="blue"
            size="sm"
            mr="2"
            onClick={handleShareClick}
          >
            Share
          </Button>
          <Button size="sm" onClick={handleCommentsClick}>
            <Box as="span" mr="1">
              <Text as="span">{post.comments ? post.comments.length : 0}</Text>{" "}
            </Box>
            <Box as="span">
              <Text as="span">Comments</Text>
            </Box>
          </Button>
        </Flex>
      </Box>
      <CommentsModal
        Pid={post.id}
        isOpen={isCommentsModalOpen}
        onClose={handleCloseCommentModal}
      />
    </Box>
  );
};

export default Posts;
