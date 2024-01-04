import { useState } from "react";
import {
  Flex,
  Heading,
  Box,
  Text,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaEye, FaTrash } from "react-icons/fa";
import { SlReload } from "react-icons/sl";

const Projects = () => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [projects, setProjects] = useState(generateProjects());

  function generateProjects() {
    return new Array(1).fill(null).map((_, index) => ({
      id: index,
      title: `Item ${index + 1}`,
      type: `Document type ${index + 1}`,
    }));
  }

  const handleContextMenu = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsContextMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsContextMenuOpen(false);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
    handleCloseMenu();
  };

  return (
    <>
      <Flex direction="column" mt={4} onContextMenu={handleContextMenu}>
        <Heading as="h2" size="xl" mb={6}>
          Recent Designs
        </Heading>

        <SimpleGrid columns={4} spacing={6}>
          {projects.map((project) => (
            <Box
              key={project.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              textAlign="center"
              position="relative"
            >
              <Heading size="md" mb={4}>
                {project.title}
              </Heading>
              <Text mb={6}>{project.type}</Text>

              <Menu isOpen={isContextMenuOpen} onClose={handleCloseMenu}>
                <MenuButton as={Box}>
                  <FaTrash />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => {}} icon={<FaEye />}>
                    View
                  </MenuItem>
                  <MenuItem onClick={() => {}} icon={<SlReload />}>
                    Recover from trash
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleDeleteProject(project.id)}
                    icon={<FaTrash />}
                  >
                    Delete from trash
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default Projects;
