import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import EditableTextField from "./sub-components/EditableTextField";
import { auth } from '../../firebase-config'
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const Security = () => {
  const navigate = useNavigate();

  const logOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        console.log('Successful Sign out');
        navigate('/auth')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="head">
        <Heading>Security</Heading>
      </div>
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />
      <div className="body">
        {/* Password */}
        <Box mb={4}>
          <Heading size="sm" mb={3}>
            Password
          </Heading>
          <EditableTextField b1="Edit" />
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        <Box my={4}>
          <Heading size="sm" mb={3}>
            Verification Status
          </Heading>
          <Text>Haven't recieved email ? Resend.</Text>
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Log out of Account */}
        <Flex my={5} gap={195}>
          <Text>Log out of your account</Text>
          <Button colorScheme="purple" size="sm" onClick={logOut}>
            Logout
          </Button>
        </Flex>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Delete Account */}
        <Flex my={5} gap={135}>
          <Text>Permanently delete your account</Text>
          <Button colorScheme="red" size="sm">
            Delete
          </Button>
        </Flex>
      </div>
    </>
  );
};

export default Security;
