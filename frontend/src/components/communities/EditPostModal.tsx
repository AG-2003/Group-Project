import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  Text,
} from "@chakra-ui/react";

interface Props {
  newTitle: string;
  newDescription: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewDescription: React.Dispatch<React.SetStateAction<string>>;
  handleEditPost: () => void;
  handleEditModalClose: () => void;
}

const EditPostModal = ({
  newTitle,
  newDescription,
  setNewTitle,
  setNewDescription,
  handleEditPost,
  handleEditModalClose,
}: Props) => {
  return (
    <Modal isOpen={true} onClose={handleEditModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>New Title</Text>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter title"
            />
            <Text>New Description</Text>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleEditPost}>
            Save
          </Button>
          <Button onClick={handleEditModalClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
