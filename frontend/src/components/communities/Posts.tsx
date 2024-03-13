import React, { useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react"; // Import Chakra UI components for styling
import { DocumentData } from "firebase/firestore";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";

import "./Posts.scss"

interface Props {
  post: DocumentData;
  onLike: (postId: string) => void; // Callback function to handle liking
  onDislike: (postId: string) => void; // Callback function to handle disliking
}

const Posts = ({ post, onLike, onDislike }: Props) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);

  const handleLikeClick = () => {
    if (!likeClicked) {
      onLike(post.id); // Call the onLike callback with the post id
      setLikeClicked(true);
      if (dislikeClicked) {
        onDislike(post.id); // Call the onDislike callback to remove dislike
        setDislikeClicked(false);
      }
    } else {
      onDislike(post.id); // Call the onDislike callback to remove like
      setLikeClicked(false);
    }
  };

  const handleDislikeClick = () => {
    if (!dislikeClicked) {
      onDislike(post.id); // Call the onDislike callback with the post id
      setDislikeClicked(true);
      if (likeClicked) {
        onLike(post.id); // Call the onLike callback to remove like
        setLikeClicked(false);
      }
    } else {
      onLike(post.id); // Call the onDislike callback to remove dislike
      setDislikeClicked(false);
    }
  };

  const handleShareClick = () => {
    // Logic to share the post link
    console.log("Share clicked");
  };

  const handleCommentsClick = () => {
    // Logic to navigate to full screen post view with comments
    console.log("Comments clicked");
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

