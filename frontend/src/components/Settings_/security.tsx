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
import { auth, db } from '../../firebase-config'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser, User, reauthenticateWithCredential, EmailAuthProvider, signOut, getRedirectResult, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { UseToastNotification } from "../../utils/UseToastNotification";
import { BadgesType } from "../../interfaces/BadgesType";


const Security = () => {
  const navigate = useNavigate();
  const showToast = UseToastNotification();

  const logOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    await signOut(auth)
      .then(() => {
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
  const curUser = auth.currentUser as User
  const [isExternalAcc, setIsExternalAcc] = useState(false)

  useEffect(() => {
    const isUsingEmailPasswordProvider = curUser?.providerData.some(
      (provider) => provider.providerId === 'password'
    );

    if (curUser && isUsingEmailPasswordProvider) {
      // The user signed in with email/password
      setIsExternalAcc(false);
    } else {
      // The user signed in with an external provider or there is no user
      setIsExternalAcc(true);
    }
  }, [curUser]);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setError('');
    setPassword('');
    setIsDeleting(false);
  };

  const handleDeny = () => {
    closePopup();
  };


  const handleSignOut = () => {
    auth.signOut();
  };


  const handleConfirm = async () => {
    //if((there is an email account logged in)||(If there is an external account logged in))
    if ((user && password && user.email) || (user && user.email && isExternalAcc)) {
      try {
        //Chakra UI delete confirmation pop up functionality
        setIsDeleting(true);
        setError('');

        //If it is not an external account, reauthenticate the email
        if (!isExternalAcc) {
          const credential = EmailAuthProvider.credential(user.email as string, password);
          await reauthenticateWithCredential(curUser, credential);
          deleteAccount();
        }
        //Else if it is an external account (G account), reauthenticate using googleAuthProvider
        else {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              deleteAccount();
            } else {
              console.log('error in authentication state validation')
            }
          });
        }
      } catch (error: any) {
        setError('Invalid password');
        setIsDeleting(false);
        console.error('Error deleting document:', (error as Error).message);
      }
    }
  };

  const deleteAccount = async () => {
    try {
      // Delete the document from Firestore
      const userDocRef = doc(db, 'users', (user as User).email as string);
      await deleteDoc(userDocRef);

      // Delete the user from Firebase Authentication
      await deleteUser(curUser);

    } catch (error: any) {
      console.error('Error deleting account:', (error as Error).message);
    } finally {
      // Close the popup
      closePopup();

      handleSignOut();

      window.location.reload();

      navigate('/auth');
    }
  };

  useEffect(() => {
    const updateUserVerificationStatus = async () => {
      if (auth.currentUser && auth.currentUser.emailVerified) {
        const userRef = doc(db, "users", auth.currentUser.email as string);

        await updateDoc(userRef, {
          emailVerified: auth.currentUser.emailVerified,
        });

        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const badges: BadgesType[] = userData.Badges || [];
          const emailVerifiedBadegIndex: number = badges.findIndex(badge => badge.name === 'Verify email');

          if (emailVerifiedBadegIndex !== -1 && !badges[emailVerifiedBadegIndex].status) {
            badges[emailVerifiedBadegIndex].status = true;
            await updateDoc(userRef, {
              Badges: badges
            })
          }

        }
      }
    };

    // Call this function right after the component mounts
    updateUserVerificationStatus();
  }, [auth.currentUser?.emailVerified]);


  const handleEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);

        showToast('info', `verification mail sent to ${auth.currentUser.email}.`);
        console.log(`email sent to ${auth.currentUser.email}`);
      } catch (err) {
        console.error(err);
        showToast('error', `${err}`);
      }
    }
  }

  const handlePasswordReset = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email)
        showToast('info', `link to reset password sent to ${auth.currentUser.email}.`);
        signOut(auth);
        setTimeout(() => { navigate('/auth') }, 3000);
      } catch (err) {
        showToast('error', `${err}`);
        console.log(err);
      }
    }
  }


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
          <Flex align="center">
            <Text

              mr='10rem'
            >
              ***********
            </Text>
            <Button onClick={handlePasswordReset}>Reset</Button>
          </Flex>
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        <Box my={4}>
          <Heading size="sm" mb={3}>
            Verification Status
          </Heading>
          <Flex align="center">
            <Text
              color={auth.currentUser?.emailVerified ? 'green' : 'red'}
              mr='10rem'
            >
              {auth.currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
            </Text>

            {!auth.currentUser?.emailVerified &&
              (<Button onClick={handleEmailVerification}>Click to verify</Button>
              )}
          </Flex>


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
                <p style={{ fontSize: '0.9rem' }}>(You are required to re-authenticate your account details)</p>
                {!isExternalAcc && (
                  <Input
                    type="password"
                    placeholder="Confirm your password to proceed"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={error !== ''}
                  />
                )}
                <FormErrorMessage>{error}</FormErrorMessage>
              </ModalBody>
              <ModalFooter>
                <Flex justifyContent="space-between">
                  <Button colorScheme="red" flex="1" mr={2} onClick={handleConfirm} isLoading={isDeleting}>
                    Confirm
                  </Button>
                  <Button flex="1" variant="outline" onClick={handleDeny}>
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