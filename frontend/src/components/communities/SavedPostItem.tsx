import React from "react";
import { Box, Button, Flex, Text, Avatar } from "@chakra-ui/react";

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

interface Props {
  post: Post;
  handleUnsavePost: (postId: string) => void;
  navigateToPost: (postId: string, postCid: string) => void;
}

const SavedPostItem: React.FC<Props> = ({
  post,
  handleUnsavePost,
  navigateToPost,
}) => {
  return (
    <Box className="saved-post">
      <Box className="post-image">
        <img src={post.image || ""} alt={post.title} />
      </Box>
      <Box className="post-details">
        <Text fontSize="md" fontWeight="bold" marginBottom="5px">
          {post.title}
        </Text>
        <Flex alignItems="center" marginBottom="5px">
          <Text fontSize="sm" marginRight="10px">
            {post.communityName}
          </Text>
          <Avatar
            size="sm"
            name={post.communityName}
            src={post.communityImage}
          />
          <Text fontSize="sm" marginLeft="10px">
            Created {post.timeAgo}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Button
            size="sm"
            marginRight="5px"
            onClick={() => navigateToPost(post.id, post.Cid)}
          >
            Go to Communtiy
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => handleUnsavePost(post.id)}
          >
            Unsave
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default SavedPostItem;
