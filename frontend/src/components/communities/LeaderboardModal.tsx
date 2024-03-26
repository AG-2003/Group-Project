import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaderboardData: { userId: string; displayName: string; likes: number }[]; // Updated interface to include displayName
}

const LeaderboardModal = ({ isOpen, onClose, leaderboardData }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Community Leaderboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {leaderboardData.length > 0 ? ( // Check if leaderboardData array is not empty
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Rank</Th>
                  <Th>User</Th>
                  <Th>Likes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {leaderboardData.map((item, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{item.displayName}</Td>
                    <Td>{item.likes}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No data available. Be the first to be the first!</Text> // Message displayed when leaderboard is empty
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LeaderboardModal;
