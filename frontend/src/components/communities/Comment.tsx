import React, { useEffect, useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react"; // Import Chakra UI components for styling
import { DocumentData } from "firebase/firestore";

interface Props {
  comment: DocumentData;
  userId: string; // User ID
  onLike: (commentId: string, userId: string) => void; // Callback function to handle liking
  onDislike: (commentId: string, userId: string) => void; // Callback function to handle disliking
}

const Comments = ({ comment, userId, onLike, onDislike }: Props) => {
  const [likeCount, setLikeCount] = useState(
    comment.likedBy ? comment.likedBy.length : 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    comment.dislikedBy ? comment.dislikedBy.length : 0
  );
  const [likeClicked, setLikeClicked] = useState(
    comment.likedBy && comment.likedBy.includes(userId)
  );
  const [dislikeClicked, setDislikeClicked] = useState(
    comment.dislikedBy && comment.dislikedBy.includes(userId)
  );
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const commentDate = new Date(comment.date);
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
  }, [comment.date]);

  const handleLikeClick = async () => {
    if (!likeClicked) {
      await onLike(comment.id, userId);
      setLikeClicked(true);
      setLikeCount(likeCount + 1);
      if (dislikeClicked) {
        await onDislike(comment.id, userId);
        setDislikeClicked(false);
        setDislikeCount(dislikeCount - 1);
      }
    } else {
      await onLike(comment.id, userId);
      setLikeClicked(false);
      setLikeCount(likeCount - 1);
    }
  };

  const handleDislikeClick = async () => {
    if (!dislikeClicked) {
      await onDislike(comment.id, userId);
      setDislikeClicked(true);
      setDislikeCount(dislikeCount + 1);
      if (likeClicked) {
        await onLike(comment.id, userId);
        setLikeClicked(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      await onDislike(comment.id, userId);
      setDislikeClicked(false);
      setDislikeCount(dislikeCount - 1);
    }
  };

  return (
    <Box>
      <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
        <Text fontSize="sm" color="gray.500" mb="2">
          {timeAgo}
        </Text>
        <Text>{comment.description}</Text>
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
        </Flex>
      </Box>
    </Box>
  );
};

export default Comments;
