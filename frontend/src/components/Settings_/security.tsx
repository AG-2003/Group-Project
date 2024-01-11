import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Modal, ModalOverlay,
  ModalContent, ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormErrorMessage
} from "@chakra-ui/react";
import EditableTextField from "./sub-components/EditableTextField";
import { auth, db, googleProvider, microsoftProvider } from '../../firebase-config'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser, User, reauthenticateWithCredential, EmailAuthProvider, reauthenticateWithRedirect, signOut, getRedirectResult } from "firebase/auth";


const Security = () => {
  const navigate = useNavigate();

  const logOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    await signOut(auth)
      .then(() => {
        console.log('Successful Sign out');
        navigate('/auth')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // useEffect(() => {
  //   if (user) {
  //     // Do something with the user email
  //   }
  // }, [user]);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setError('');
    setPassword('');
    setIsDeleting(false);
  };




  const handleConfirm = async () => {
    if (user) {
      try {
        setIsDeleting(true);
        setError('');

        const providerId: string = user.providerData[0].providerId;

        if (providerId === 'google.com') {
          await reauthenticateWithRedirect(user, googleProvider)
            .then(async () => {
              const result = await getRedirectResult(auth);
              if (result && result.user) {
                const userDocRef = doc(db, 'users', result?.user?.email as string);
                await deleteDoc(userDocRef);
                await deleteUser(result?.user);
                closePopup();
                signOut(auth);
                window.location.reload();
                navigate('/auth')
              }

            })
            .catch((err) => {
              console.error(err);
            })
        } else if (providerId === 'microsoft.com') {
          await reauthenticateWithRedirect(user, microsoftProvider)
            .then(async () => {
              const result = await getRedirectResult(auth);
              if (result && result.user) {
                const userDocRef = doc(db, 'users', result?.user?.email as string);
                await deleteDoc(userDocRef);
                await deleteUser(result?.user);
                closePopup();
                signOut(auth);
                window.location.reload();
                navigate('/auth')
              }
            })
            .catch((err) => {
              console.error(err);
            })
        } else {
          // Reauthenticate the user
          const credential = EmailAuthProvider.credential(user.email as string, password);
          await reauthenticateWithCredential(user, credential);

          // Delete the document from Firestore
          const userDocRef = doc(db, 'users', user.email as string);
          await deleteDoc(userDocRef);

          // Delete the user from Firebase Authentication
          await deleteUser(user);

          // Close the popup
          closePopup();
          signOut(auth);
          window.location.reload();
          navigate('/auth')
        }



      } catch (error: any) {
        setError('Invalid password');
        setIsDeleting(false);
        console.error('Error deleting document:', (error as Error).message);
      }
    }
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
          <Button colorScheme="red" size="sm" onClick={openPopup}>
            Delete
          </Button>
          {/* Pop up for Account deletion confirmation */}
          <Modal isOpen={isOpen} onClose={closePopup} blockScrollOnMount={false} motionPreset="none" isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <ModalCloseButton onClick={closePopup} />
              </ModalHeader>
              <ModalBody>
                <p className="popup-text">Are you sure you would like to remove this account from the site? This action may not be undone.</p>
                <br />
                <Input
                  type="password"
                  placeholder="Confirm your password to proceed"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={error !== ''}
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </ModalBody>
              <ModalFooter>
                <Flex justifyContent="space-between">
                  <Button colorScheme="red" flex="1" mr={2} onClick={handleConfirm} isLoading={isDeleting}>
                    Confirm
                  </Button>
                  <Button flex="1" variant="outline" onClick={closePopup}>
                    Deny
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </div>
    </>
  );
};

export default Security;
