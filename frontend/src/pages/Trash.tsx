import { Box, Flex, Heading, Icon } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa6";

const Trash = () => {
  return (
    <>
      <Flex
        direction="column"
        mt={4} // Margin top for the whole container
      >
        <Heading as="h2" size="xl" mb={6}>
          Recently Deleted
        </Heading>
      </Flex>
      <Flex
        direction="column"
        align="center" // Center horizontally
        justify="center" // Center vertically
        height="60vh"
      >
        <Box mb={2}>
          <Icon as={FaTrash} boxSize={10} color="gray.500" />
        </Box>
        <Heading as="h4" size="md" color="gray.500">
          Empty
        </Heading>
      </Flex>
    </>
  );
};

export default Trash;
