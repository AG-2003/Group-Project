import { Flex, Heading, Box, Text, SimpleGrid } from "@chakra-ui/react";

const Projects = () => {
  // Dummy data for the grid items
  const projects = new Array(8).fill(null).map((_, index) => ({
    title: `Document Title`,
    type: `Document type`,
  }));

  return (
    <>
      <Flex
        direction="column"
        mt={4} // Margin top for the whole container
      >
        <Heading as="h2" size="xl" mb={6}>
          Recent Designs
        </Heading>

        {/* Grid layout for the projects */}
        <SimpleGrid columns={4} spacing={6}>
          {projects.map((project, index) => (
            <Box
              key={index}
              p={5} // Padding inside the box
              shadow="md" // Mild shadow
              borderWidth="1px" // Border width
              borderRadius="md" // Border radius
              textAlign="center" // Centers the content inside the box
            >
              <Heading size="md" mb={4}>
                {project.title}
              </Heading>
              <Text mb={6}>{project.type}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default Projects;
