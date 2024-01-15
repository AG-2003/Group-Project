import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
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

interface TeamData {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
}

const CreateTeamModal = ({ isOpen, onClose }: Props) => {
  const [page, setPage] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [emailInputs, setEmailInputs] = useState([""]);
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

  const saveTeamToFirestore = async () => {
    if (!user || !user.uid) {
      alert("You must be signed in to create a team");
      return;
    }

    const newTeam: TeamData = {
      id: teamName.toLowerCase().replace(/\s+/g, "-"),
      name: teamName,
      description: teamDescription,
      role: teamRole,
      members: emailInputs.filter((email) => email.trim() !== ""),
    };

    try {
      // Reference to the user's document
      const userDocRef = doc(db, "users", user.uid);

      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the user document exists, update the teams field
        const userData = userDocSnapshot.data();
        const updatedTeams = [...userData.teams, newTeam]; // Assuming "teams" is an array field in your user document
        await setDoc(userDocRef, { teams: updatedTeams }, { merge: true });
      } else {
        // If the user document doesn't exist, create it with the "teams" field
        await setDoc(userDocRef, { teams: [newTeam] });
      }

      console.log("Team saved successfully");
      onClose();
      setPage(1);
      setTeamName("");
      setTeamDescription("");
      setTeamRole("");
      setEmailInputs([""]);
    } catch (error) {
      console.error("Error saving team:", error);
      alert("There was an error saving the team. Please try again.");
    }
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

export default CreateTeamModal;
