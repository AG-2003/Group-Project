import React, { useState } from "react";
import {
  Flex,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  Textarea,
  Select,
  Link,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const CreateTeamModal = ({ isOpen, onClose }: Props) => {
  const [page, setPage] = useState(1);
  const [emailInputs, setEmailInputs] = useState([""]); // State to manage email inputs

  const handleNextPage = () => {
    if (page === 1) {
      setPage(page + 1);
    } else {
      onClose();
      setPage(page - 1);
    }
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleAddInvitation = () => {
    setEmailInputs((prevEmails) => [...prevEmails, ""]);
  };

  const handleEmailInputChange = (index: number, value: string) => {
    setEmailInputs((prevEmails) => {
      const updatedEmails = [...prevEmails];
      updatedEmails[index] = value;
      return updatedEmails;
    });
  };

  const renderModalContent = () => {
    switch (page) {
      case 1:
        return (
          <>
            <Heading>Create your own team</Heading>
            <Text mb={4} marginTop={5}>
              Team Name
            </Text>
            <Input mb={4} placeholder="Name" />
            <Text mb={4}>Team Description</Text>
            <Textarea mb={4} placeholder="Description" />
            <Text mb={4}>Your Role</Text>
            <Select mb={4} placeholder="Choose a role">
              <option value="teacher">Teacher</option>
              <option value="educator">Educator</option>
              <option value="business">Business</option>
              <option value="creator">Creator</option>
            </Select>
          </>
        );
      case 2:
        return (
          <>
            <Heading>Invite your team</Heading>
            <Text mb={4} marginTop={5} marginBottom={5}>
              Bring your whole team to collaborate on your projects.
            </Text>
            <Link mb={4} onClick={() => console.log("Get invite link clicked")}>
              <Flex align="center" mb={5}>
                Get invite link
              </Flex>
            </Link>
            {emailInputs.map((email, index) => (
              <Input
                key={index}
                mb={4}
                placeholder="Enter email address"
                value={email}
                onChange={(e) => handleEmailInputChange(index, e.target.value)}
              />
            ))}
            <Text
              color="blue.500"
              cursor="pointer"
              mb={4}
              onClick={handleAddInvitation}
            >
              Add Invitation
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{page === 1 ? "Create Team" : "Invite Team"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderModalContent()}</ModalBody>
        <ModalFooter>
          {page !== 1 && (
            <Button colorScheme="blue" mr={3} onClick={handlePreviousPage}>
              Previous
            </Button>
          )}
          <Button colorScheme="blue" onClick={handleNextPage}>
            {page === 1 ? "Next" : "Finish"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTeamModal;
