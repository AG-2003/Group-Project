import "./settings.css";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import EditableTextField from "./sub-components/EditableTextField";
import { useEffect, useState } from "react";
// import { sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { updateProfile, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";


const Account = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleFileChange = (event: any | null) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the file
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
    }
  };

  const handleImageSelection = async (event: any | null) => {


    const file = event.target.files[0];
    if (file && auth.currentUser) {
      // Create a URL for the file
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
      try {
        await updateProfile(auth.currentUser, {
          photoURL: avatarUrl
        })
        const userRef = doc(db, "users", auth.currentUser.email as string)
        await updateDoc(userRef, {
          photoURL: avatarUrl
        })
        console.log("Profile photo updated successfully");
      } catch (err) {
        console.log(err);
        console.log("Error updating profile photo:", err);
      }
    }
  }



  const handleUsernameSave = async (newUsername: string) => {

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newUsername
        });
        // TODO: handle database update here
        const userRef = doc(db, "users", auth.currentUser.email as string)
        await updateDoc(userRef, {
          displayName: newUsername
        })
        console.log(`updated username to ${auth.currentUser.displayName}`);
      } catch (err) {
        console.error(err);
      }
    }
  }

  const [userDescription, setUserDescription] = useState<string>('Write about yourself !');

  const handleDescriptionSave = async (description: string) => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.email as string)
        await updateDoc(userRef, {
          desc: description
        })
        console.log(`description updated to ${description}`);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          console.log(docSnap.data().desc);
          setUserDescription(docSnap.data().desc);
        }

      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleUserTypeSave = () => {

  }



  return (
    <>
      {/* Header */}
      <div className="head">
        <Heading>Your Account</Heading>
      </div>
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

      {/* Body */}
      <div className="body">
        {/* Profile Picture */}
        <Flex>
          <Avatar src={auth.currentUser?.photoURL || ''} referrerPolicy="no-referrer" className="avatar" />
          <Box className="upload-section">
            <Box className="text">Update your profile photo</Box>
            <Input
              type="file"
              accept="image/*"
              hidden
              id="file-upload"
              onChange={handleImageSelection}
            />
            <Button
              className="button button-upload"
              colorScheme="purple"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Upload
            </Button>
          </Box>
        </Flex>
        <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

        {/* Display Name */}
        <Box my={4}>
          <Heading size="sm" mb={3}>
            Display Name
          </Heading>
          <EditableTextField
            b1="Edit"
            initialValue={auth.currentUser?.displayName ? auth.currentUser.displayName : 'click on edit to set username'}
            onSave={handleUsernameSave} />
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Description */}
        <Box my={4}>
          <Heading size="sm" mb={3}>
            Description
          </Heading>
          <EditableTextField b1="Edit" initialValue={userDescription} onSave={handleDescriptionSave} />
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Role */}
        <VStack spacing={4} align="stretch" my={4}>
          <Heading size="sm">What are you using the app for?</Heading>
          <Select
            placeholder="Select option"
            maxW="435px" /* or use a specific value like w="300px" */
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="creator">Creator</option>
            <option value="business">Small Business</option>
            <option value="business">Personal</option>
          </Select>
        </VStack>
      </div>
      {/* <Divider borderColor="lightgrey" borderWidth="1px" maxW="" /> */}
    </>
  );
};

export default Account;
