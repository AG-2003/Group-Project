import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
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

interface TeamData {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TeamModal: React.FC<Props> = ({ isOpen, onClose }: Props) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [emailInputs, setEmailInputs] = useState([""]);
  const [page, setPage] = useState(1); // Add page state
  const [user] = useAuthState(auth);

  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const handleTeamDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTeamDescription(event.target.value);
  };

  const handleTeamRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTeamRole(event.target.value);
  };

  const handleEmailInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = event.target.value;
    setEmailInputs(newEmailInputs);
  };

  const handleNextPage = () => {
    if (page === 1) {
      setPage(page + 1);
    } else {
      saveTeamToFirestore();
    }
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleAddInvitation = () => {
    setEmailInputs((prevEmails) => [...prevEmails, ""]);
  };

  const saveTeamToFirestore = async () => {
    try {
      const username = user?.email; // Replace with the actual username
      if (username) {
        const userDocRef = doc(db, "users", username);
        const docSnapshot = await getDoc(userDocRef);
        let teamsArray: TeamData[] = [];

        if (docSnapshot.exists()) {
          teamsArray = docSnapshot.data().teams || [];
        }

        const newTeam: TeamData = {
          id: teamName.toLowerCase().replace(/\s+/g, "-"),
          name: teamName,
          description: teamDescription,
          role: teamRole,
          members: emailInputs.filter((email) => email.trim() !== ""),
        };

        const existingTeamIndex = teamsArray.findIndex(
          (team: TeamData) => team.id === newTeam.id
        );

        if (existingTeamIndex !== -1) {
          teamsArray[existingTeamIndex] = newTeam;
        } else {
          teamsArray.push(newTeam);
        }

        await setDoc(
          userDocRef,
          {
            teams: teamsArray,
          },
          { merge: true }
        );
        console.log("Team saved successfully");
      }
    } catch (error) {
      console.error("Error saving team:", error);
    }
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
            <Input
              mb={4}
              placeholder="Name"
              value={teamName}
              onChange={handleTeamNameChange}
            />
            <Text mb={4}>Team Description</Text>
            <Textarea
              mb={4}
              placeholder="Description"
              value={teamDescription}
              onChange={handleTeamDescriptionChange}
            />
            <Text mb={4}>Your Role</Text>
            <Select
              mb={4}
              placeholder="Choose a role"
              value={teamRole}
              onChange={handleTeamRoleChange}
            >
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
                onChange={(e) => handleEmailInputChange(index, e)}
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
        <ModalHeader>
          {page === 1 ? "Create your own team" : "Invite your team"}
        </ModalHeader>
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

export default TeamModal;
