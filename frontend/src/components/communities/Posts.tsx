import React, { useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react"; // Import Chakra UI components for styling
import { DocumentData } from "firebase/firestore";
import CommentsModal from "./commentsModal";

interface Props {
  post: DocumentData;
  userId: string; // User ID
  onLike: (postId: string, userId: string) => void; // Callback function to handle liking
  onDislike: (postId: string, userId: string) => void; // Callback function to handle disliking
}

const Posts = ({ post, userId, onLike, onDislike }: Props) => {
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

  return (
    <Box>
      <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
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
        <Text fontSize="lg" fontWeight="bold" mb="2">
          {post.title}
        </Text>
        <Text fontSize="sm" color="gray.500" mb="2">
          Date Posted: {post.date}
        </Text>
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
              <Text as="span">{post.commentsCount || 0}</Text>{" "}
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
