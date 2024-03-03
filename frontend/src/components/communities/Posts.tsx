import React, { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react"; // Import Chakra UI components for styling

const Posts: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);

  const handleLikeClick = () => {
    if (!likeClicked) {
      setLikes(likes + 1);
      setLikeClicked(true);
      if (dislikeClicked) {
        setDislikes(dislikes - 1);
        setDislikeClicked(false);
      }
    }
  };

  const handleDislikeClick = () => {
    if (!dislikeClicked) {
      setDislikes(dislikes + 1);
      setDislikeClicked(true);
      if (likeClicked) {
        setLikes(likes - 1);
        setLikeClicked(false);
      }
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Latest Posts
      </Text>
      {/* Example post */}
      <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
        {/* Blank square for picture */}
        <Box
          bg="gray.200"
          w="100%"
          h="300px" // Adjust the height of the square as needed
          mb="4"
        />
        <Text fontSize="lg" fontWeight="bold" mb="2">
          Post Title
        </Text>
        <Text fontSize="sm" color="gray.500" mb="2">
          Date Posted: January 1, 2024
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          tristique magna ut purus facilisis, non hendrerit risus fringilla.
          Nullam eget consequat mi.
        </Text>
        {/* Like and Dislike buttons with counters */}
        <Button
          colorScheme="green"
          size="sm"
          mt="2"
          mr="2"
          onClick={handleLikeClick}
          isDisabled={likeClicked}
        >
          Like ({likes})
        </Button>
        <Button
          colorScheme="red"
          size="sm"
          mt="2"
          mr="2"
          onClick={handleDislikeClick}
          isDisabled={dislikeClicked}
        >
          Dislike ({dislikes})
        </Button>
      </Box>
    </Box>
  );
};

export default Posts;
