import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { auth, db } from "../../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { RxCross2 } from "react-icons/rx";

interface Props {
  isOpen: boolean;
  teamId: string | undefined;
  onClose: () => void;
}

const InvModal: React.FC<Props> = ({ isOpen, onClose, teamId }: Props) => {
  const [emailInputs, setEmailInputs] = useState([""]);
  const [user] = useAuthState(auth);

  const removeField = (RemoveIndex: Number) => {
    setEmailInputs((prevEmails) => {
      const updatedEmails = prevEmails.filter(
        (_, index) => index !== RemoveIndex
      );
      return updatedEmails;
    });
  };

  const saveTeamToFirestore = async () => {
    try {
      // get the user
      const userMail = user?.email;

      // create the team
      if (userMail) {
        // for invite
        for (const email of emailInputs.filter(
          (email) => email.trim() !== ""
        )) {
          const memberDocRef = doc(db, "users", email);
          const memberDocSnapshot = await getDoc(memberDocRef);

          if (memberDocSnapshot.exists()) {
            // Add the team to the user's teams array
            await updateDoc(memberDocRef, {
              teams: [...(memberDocSnapshot.data()?.teams || []), teamId],
            });
          }
        }

        console.log("invite done successfully");
      }
    } catch (error) {
      console.error("Error inviting team:", error);
    }
  };

  const quickClose = () => {
    setEmailInputs([""]);
  };

  const handleClose = () => {
    saveTeamToFirestore();
    onClose();
  };

  const handleEmailInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = event.target.value;
    setEmailInputs(newEmailInputs);
  };

  const handleAddInvitation = () => {
    setEmailInputs((prevEmails) => [...prevEmails, ""]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite your team</ModalHeader>
        <ModalCloseButton onClick={quickClose} />
        <ModalBody>
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
            <Flex align="center">
              <Input
                key={index}
                mb={4}
                placeholder="Enter email address"
                value={email}
                onChange={(e) => handleEmailInputChange(index, e)}
              />
              <Box marginTop={-4} marginRight={-5} padding={3}>
                {index !== 0 && (
                  <RxCross2
                    color="red"
                    onClick={() => {
                      removeField(index);
                    }}
                  />
                )}
              </Box>
            </Flex>
          ))}
          <Text
            color="blue.500"
            cursor="pointer"
            mb={4}
            onClick={handleAddInvitation}
          >
            Add Invitation
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Finish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InvModal;
