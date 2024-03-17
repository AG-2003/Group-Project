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
} from "@chakra-ui/react";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { BiMessageSquareAdd, BiTask } from "react-icons/bi";

interface PostData {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string | null;
  Cid: string;
  Uid: string;
  Uname: string;
  Upic: string;
  date: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  Cid: string;
  Uid: string;
}

const PostModal: React.FC<Props> = ({ isOpen, onClose, Cid, Uid }: Props) => {
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postType, setPostType] = useState("");
  const [image, setImage] = useState<File | null>(null); // State to store the selected image
  const [page, setPage] = useState(1);
  const [user] = useAuthState(auth);

  const handlePostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(event.target.value);
  };

  const handlePostDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostDescription(event.target.value);
  };

  const handlePostTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPostType(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const SaveNClose = () => {
    savePostToFirestore();
    onClose();
  };

  const quickClose = () => {
    setPage(1);
  };

  const savePostToFirestore = async () => {
    try {
      // get the user
      const userMail = user?.email;

      // create the post
      if (userMail) {
        const newPost: PostData = {
          id: postTitle.toLowerCase().replace(/\s+/g, "-93217"),
          title: postTitle,
          description: postDescription,
          type: postType,
          image: null, // Initialize with null value
          Cid: Cid,
          Uid: Uid,
          Uname: user?.displayName || "",
          Upic: user?.photoURL || "",
          date: new Date().toISOString(),
        };

        // go to the firestore and into the collection communityPosts
        const postDocRef = doc(db, "communityPosts", newPost.id);

        // go to the firstore and into the collection users and into that specific user
        const DocRef = doc(db, "users", userMail);

        // go to the firstore and into the collection communities
        const CDocRef = doc(db, "communities", Cid);

        // wait for response
        const docSnapshot = await getDoc(postDocRef);
        const userDocSnapshot = await getDoc(DocRef);
        const CDocSnapshot = await getDoc(CDocRef);

        if (docSnapshot.exists()) {
          console.error("Post ID already exists");
          return;
        }

        // Save the post data in the post document
        await setDoc(postDocRef, newPost);

        // Save the post ID in the user document and its collection
        await updateDoc(DocRef, {
          posts: [...(userDocSnapshot.data()?.posts || []), newPost.id],
        });

        await updateDoc(CDocRef, {
          posts: [...(CDocSnapshot.data()?.posts || []), newPost.id],
        });

        if (image) {
          // If an image is selected, upload it to Firebase Storage
          const storage = getStorage();
          const storagePath = `postImages/${postTitle
            .toLowerCase()
            .replace(/\s+/g, "-")}/${image.name}`;
          const imageRef = storageRef(storage, storagePath);
          const snapshot = await uploadBytes(imageRef, image);

          // Get the download URL and update newPost
          const postImageUrl = await getDownloadURL(snapshot.ref);
          newPost.image = postImageUrl;

          // Update the post document with the image URL
          await updateDoc(postDocRef, {
            image: postImageUrl,
          });
        }

        console.log("Post saved successfully");

        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const renderModalContent = () => {
    switch (page) {
      case 1:
        return (
          <>
            <Heading>Create a post</Heading>
            <Text mb={4} marginTop={5}>
              Post Title
            </Text>
            <Input
              mb={4}
              placeholder="Title"
              value={postTitle}
              onChange={handlePostNameChange}
            />
            <Text mb={4}>Post Description</Text>
            <Textarea
              mb={4}
              placeholder="Description"
              value={postDescription}
              onChange={handlePostDescriptionChange}
            />
            <Text mb={4}>Post Image</Text>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              mb={4}
            />
          </>
        );
      case 2:
        return (
          <>
            <Heading>Create a post</Heading>
            <Text mb={4} marginTop={5}>
              Post Title
            </Text>
            <Input
              mb={4}
              placeholder="Title"
              value={postTitle}
              onChange={handlePostNameChange}
            />
            <Text mb={4}>Project link</Text>
            <Input type="file" onChange={handleImageChange} mb={4} />

            <Text mb={4}>Post Description</Text>
            <Textarea
              mb={4}
              placeholder="Description"
              value={postDescription}
              onChange={handlePostDescriptionChange}
            />
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
          <Button
            colorScheme={page === 1 ? "blue" : "gray"}
            onClick={() => {
              setPage(1);
              handlePostTypeChange({
                target: { value: "Post" },
              } as React.ChangeEvent<HTMLSelectElement>);
            }}
            mr={2}
            leftIcon={<BiMessageSquareAdd />}
          >
            Post
          </Button>
          <Button
            colorScheme={page === 2 ? "blue" : "gray"}
            onClick={() => {
              setPage(2);
              handlePostTypeChange({
                target: { value: "Project" },
              } as React.ChangeEvent<HTMLSelectElement>);
            }}
            leftIcon={<BiTask />}
          >
            Project
          </Button>
        </ModalHeader>

        <ModalCloseButton onClick={quickClose} />
        <ModalBody>{renderModalContent()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={SaveNClose}>
            Complete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
