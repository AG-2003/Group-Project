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
                  <Td>{item.displayName}</Td>{" "}
                  {/* Displaying displayName instead of userId */}
                  <Td>{item.likes}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
