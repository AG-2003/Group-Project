import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  // Spacer,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import CreateTeamModal from "../components/Teams/TeamModal";

const TeamsPage = () => {
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  const handleCreateTeamClick = () => {
    setCreateTeamModalOpen(true);
  };

  const handleCloseCreateTeamModal = () => {
    setCreateTeamModalOpen(false);
  };

  return (
    <Flex direction="column" height="100vh" p={8}>
      {/* Section 1: Join or Create a Team */}
      <Box mb={8}>
        <Heading as="h2" size="xl">
          Join or Create a Team
        </Heading>
      </Box>
      <Flex>
        {/* Create a Team button */}
        <Box flex="1" textAlign="center">
          <Box
            bg="blue.500"
            color="white"
            p={4}
            borderRadius="lg"
            cursor="pointer"
            width="170px"
            height="150px"
            _hover={{ bg: "blue.900" }}
            textAlign="center"
            onClick={handleCreateTeamClick}
          >
            <FaPlusCircle size={32} />
            <Heading size="md" mt={2}>
              Create a Team
            </Heading>
          </Box>
        </Box>

        {/* Join a Team button */}
        <Box flex="1" textAlign="center">
          <Box
            bg="green.500"
            color="white"
            p={4}
            borderRadius="lg"
            cursor="pointer"
            width="170px"
            height="150px"
            _hover={{ bg: "green.900" }}
          >
            <FaPlusCircle size={32} />
            <Heading size="md" mt={2}>
              Join a Team
            </Heading>
          </Box>
        </Box>
      </Flex>

      {/* Margin between sections */}
      <Box mt={8} />

      {/* Section 2: Your Teams */}
      <Box>
        <Heading as="h2" size="xl">
          Your Teams
        </Heading>
        <Box mt={4}>
          <p style={{ fontSize: "24px", color: "silver" }}>
            You are not in any teams.
          </p>
        </Box>
      </Box>

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={handleCloseCreateTeamModal}
      />
    </Flex>
  );
};

export default TeamsPage;
