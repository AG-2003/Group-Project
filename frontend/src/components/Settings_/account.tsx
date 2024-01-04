import "./Settings.css";
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
import { useState } from "react";
// import { sendEmailVerification } from "firebase/auth";
// import { auth } from "../../firebase-config";

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

  // logic for checking if users Email address is verified.

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
          <Avatar src={avatarUrl} className="avatar" />
          <Box className="upload-section">
            <Box className="text">Update your profile photo</Box>
            <Input
              type="file"
              accept="image/*"
              hidden
              id="file-upload"
              onChange={handleFileChange}
            />
            <Button
              className="button button-upload"
              colorScheme="purple"
              size="sm"
            // onClick={() => document.getElementById('file-upload').click()}
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
          <EditableTextField b1="Edit" />
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Description */}
        <Box my={4}>
          <Heading size="sm" mb={3}>
            Description
          </Heading>
          <EditableTextField b1="Edit" />
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
