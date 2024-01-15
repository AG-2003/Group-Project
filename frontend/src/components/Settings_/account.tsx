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
  Skeleton,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import EditableTextField from "./sub-components/EditableTextField";
import { useEffect, useState } from "react";
// import { sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { updateProfile, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";



const Account = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [avatarUrl, setAvatarUrl] = useState(auth.currentUser?.photoURL || '');


  const handleImageSelection = async (event: any) => {
    const file = event.target.files[0];
    if (file && auth.currentUser) {
      // Use the file to show a preview to the user
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl); // Update the state variable for preview

      // Define where you want to store the image in Firebase Storage
      const storage = getStorage();
      const storagePath = `profilePictures/${auth.currentUser.uid}/${file.name}`;
      const imageRef = storageRef(storage, storagePath);

      try {
        // Upload the image to Firebase Storage
        const snapshot = await uploadBytes(imageRef, file);

        // Get the permanent URL from Firebase Storage
        const permanentUrl = await getDownloadURL(snapshot.ref);

        // Update the user's profile with the permanent URL
        await updateProfile(auth.currentUser, {
          photoURL: permanentUrl
        });

        // Update the Firestore document
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          photoURL: permanentUrl
        });

        console.log("Profile photo updated successfully");

        // Update the avatarUrl state with the permanent URL for further use
        setAvatarUrl(permanentUrl);

        // Clean up the preview URL as it's no longer needed
        URL.revokeObjectURL(previewUrl);

      } catch (err) {
        console.error("Error updating profile photo:", err);

      }
    }
  };



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
  const [loadingDescription, setLoadingDescription] = useState<boolean>(true);

  useEffect(() => {
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;
      if (userEmail) {
        const userRef = doc(db, 'users', userEmail);
        getDoc(userRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              if (userData && userData.desc) {
                setUserDescription(userData.desc);
              } else {
                setUserDescription('You have not set a description yet.');
              }
            } else {
              setUserDescription('You have not set a description yet.');
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          })
          .finally(() => {
            setLoadingDescription(false); // Set loading to false after fetching data
          });
      } else {
        console.log("User email is null or undefined.");
        setLoadingDescription(false);
      }
    } else {
      console.log("No user is currently logged in.");
      setLoadingDescription(false);
    }
  }, []);


  const handleDescriptionSave = async (description: string) => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.email as string)
        await updateDoc(userRef, {
          desc: description
        })
        console.log(`description updated to ${description}`);
        setUserDescription(description);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const [selectedRole, setSelectedRole] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userEmail = auth.currentUser.email;
        if (userEmail) {
          const userRef = doc(db, 'users', userEmail);
          try {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              if (userData.userType) {
                setUserType(userData.userType); // Set the fetched user type
              }
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          console.log("User email is null or undefined.");
        }
      }
    };

    fetchUserData();
  }, []);


  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };


  const handleUserTypeSave = async () => {
    if (auth.currentUser && selectedRole) {
      try {
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          userType: selectedRole
        });
        setUserType(selectedRole);
        console.log(`User type updated to ${selectedRole}`);
      } catch (err) {
        console.error("Error updating user type:", err);
      }
    }
  };




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
          <Avatar src={avatarUrl} referrerPolicy="no-referrer" className="avatar" />
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
          {loadingDescription ? (
            <Skeleton />
          ) : (
            <EditableTextField
              b1="Edit"
              initialValue={userDescription}
              onSave={handleDescriptionSave}
            />
          )}
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Role */}
        <VStack spacing={4} align="stretch" my={4}>
          <Heading size="sm">What are you using the app for?</Heading>
          <Flex>
            <Select
              placeholder="Select option"
              maxW="435px"
              value={selectedRole || userType}
              onChange={handleRoleChange}
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="creator">Creator</option>
              <option value="business">Small Business</option>
              <option value="personal">Personal</option>
            </Select>
            <Button size="sm" onClick={handleUserTypeSave} ml={10}>
              Save Role
            </Button>
          </Flex>

        </VStack>
      </div>
      {/* <Divider borderColor="lightgrey" borderWidth="1px" maxW="" /> */}
    </>
  );
};

export default Account;
