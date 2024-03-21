import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {
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
} from "@chakra-ui/react";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface CommunityData {
  id: string;
  name: string;
  description: string;
  status: string;
  members: string[];
  image: string | null;
  admins: string[];
  creator: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CommunityModal: React.FC<Props> = ({ isOpen, onClose }: Props) => {
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityStatus, setCommunityStatus] = useState("Public");
  const [image, setImage] = useState<File | null>(null);
  const [user] = useAuthState(auth);

  const handleCommunityNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityName(event.target.value);
  };

  const handleCommunityDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommunityDescription(event.target.value);
  };

  const handleCommunityStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCommunityStatus(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleNextPage = () => {
    saveCommunityToFirestore();
    onClose(); // Close the modal when saving is complete
  };

  const saveCommunityToFirestore = async () => {
    try {
      const usermail = user?.email;

      if (usermail) {
        const newCommunity: CommunityData = {
          id: communityName.toLowerCase().replace(/\s+/g, "-93217"),
          name: communityName,
          description: communityDescription,
          status: communityStatus,
          members: [usermail],
          image: null,
          creator: usermail,
          admins: [usermail],
        };

        const communityDocRef = doc(db, "communities", newCommunity.id);

        const DocRef = doc(db, "users", usermail);

        const docSnapshot = await getDoc(communityDocRef);
        const userDocSnapshot = await getDoc(DocRef);

        if (docSnapshot.exists()) {
          console.error("Community ID already exists");
          return;
        }

        await setDoc(communityDocRef, newCommunity);

        // Add the community ID to the user's communities list
        await updateDoc(DocRef, {
          communities: [
            ...(userDocSnapshot.data()?.communities || []),
            newCommunity.id,
          ],
        });

        if (image) {
          const storage = getStorage();
          const storagePath = `communityImages/${communityName
            .toLowerCase()
            .replace(/\s+/g, "-")}/${image.name}`;
          const imageRef = storageRef(storage, storagePath);
          const snapshot = await uploadBytes(imageRef, image);

          const communityImageUrl = await getDownloadURL(snapshot.ref);
          newCommunity.image = communityImageUrl;

          await updateDoc(communityDocRef, {
            image: communityImageUrl,
          });
        }

        console.log("Community saved successfully");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error saving community:", error);
    }
  };

  const renderModalContent = () => {
    return (
      <>
        <Heading>Create a Community</Heading>
        <Text mb={4} marginTop={5}>
          Community Name
        </Text>
        <Input
          mb={4}
          placeholder="Name"
          value={communityName}
          onChange={handleCommunityNameChange}
        />
        <Text mb={4}>Description</Text>
        <Textarea
          mb={4}
          placeholder="Description"
          value={communityDescription}
          onChange={handleCommunityDescriptionChange}
        />
        <Text mb={4}>Status</Text>
        <Select
          mb={4}
          value={communityStatus}
          onChange={handleCommunityStatusChange}
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </Select>

        <Text mb={4}>Community Logo</Text>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          mb={4}
        />
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Community</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderModalContent()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleNextPage}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommunityModal;
