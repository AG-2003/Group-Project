// import "./settings.css";
// import {
//   Avatar,
//   Box,
//   Button,
//   Divider,
//   Flex,
//   Heading,
//   Grid,
//   GridItem,
//   Spacer,
//   Input,
//   Text,
//   Progress,
//   Select,
//   Skeleton,
//   SkeletonCircle,
//   Spinner,
//   VStack,
// } from "@chakra-ui/react";
// import EditableTextField from "./sub-components/EditableTextField";
// import { useEffect, useState } from "react";
// // import { sendEmailVerification } from "firebase/auth";
// import { auth, db } from "../../firebase-config";
// import {
//   updateProfile,
//   sendEmailVerification,
//   sendPasswordResetEmail,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";
// import { UseToastNotification } from "../../utils/UseToastNotification";

// const Account = () => {
//   const showToast = UseToastNotification();

//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [avatarUrl, setAvatarUrl] = useState(auth.currentUser?.photoURL || "");

//   const handleImageSelection = async (event: any) => {
//     const file = event.target.files[0];
//     if (file && auth.currentUser) {
//       // Use the file to show a preview to the user
//       const previewUrl = URL.createObjectURL(file);
//       setAvatarUrl(previewUrl); // Update the state variable for preview
//       showToast("success", `updated User profile pic.`);

//       // Define where you want to store the image in Firebase Storage
//       const storage = getStorage();
//       const storagePath = `profilePictures/${auth.currentUser.uid}/${file.name}`;
//       const imageRef = storageRef(storage, storagePath);

//       try {
//         // Upload the image to Firebase Storage
//         const snapshot = await uploadBytes(imageRef, file);

//         // Get the permanent URL from Firebase Storage
//         const permanentUrl = await getDownloadURL(snapshot.ref);

//         // Update the user's profile with the permanent URL
//         await updateProfile(auth.currentUser, {
//           photoURL: permanentUrl,
//         });

//         // Update the Firestore document
//         const userRef = doc(db, "users", auth.currentUser.email as string);
//         await updateDoc(userRef, {
//           photoURL: permanentUrl,
//         });

//         console.log("Profile photo updated successfully");

//         // Update the avatarUrl state with the permanent URL for further use
//         setAvatarUrl(permanentUrl);

//         // Clean up the preview URL as it's no longer needed
//         URL.revokeObjectURL(previewUrl);
//       } catch (err) {
//         console.error("Error updating profile photo:", err);
//         showToast("error", "error updating profile photo.");
//       }
//     }
//   };

//   const handleUsernameSave = async (newUsername: string) => {
//     if (auth.currentUser) {
//       try {
//         await updateProfile(auth.currentUser, {
//           displayName: newUsername,
//         });
//         // TODO: handle database update here
//         const userRef = doc(db, "users", auth.currentUser.email as string);
//         await updateDoc(userRef, {
//           displayName: newUsername,
//         });

//         showToast("success", `updated username to ${newUsername}`);
//       } catch (err) {
//         console.error(err);
//         showToast("error", "error updating username.");
//       }
//     }
//   };

//   const [userDescription, setUserDescription] = useState<string>(
//     "Write about yourself !"
//   );
//   const [loadingDescription, setLoadingDescription] = useState<boolean>(true);
//   const [loadingUserType, setLoadingUserType] = useState<boolean>(true);

//   useEffect(() => {
//     if (auth.currentUser) {
//       const userEmail = auth.currentUser.email;
//       if (userEmail) {
//         const userRef = doc(db, "users", userEmail);
//         getDoc(userRef)
//           .then((docSnap) => {
//             if (docSnap.exists()) {
//               const userData = docSnap.data();
//               if (userData && userData.desc) {
//                 setUserDescription(userData.desc);
//               } else {
//                 setUserDescription("You have not set a description yet.");
//               }
//             } else {
//               setUserDescription("You have not set a description yet.");
//             }
//           })
//           .catch((error) => {
//             console.error("Error fetching user data:", error);
//           })
//           .finally(() => {
//             setLoadingDescription(false); // Set loading to false after fetching data
//           });
//       } else {
//         console.log("User email is null or undefined.");
//         setLoadingDescription(false);
//       }
//     } else {
//       console.log("No user is currently logged in.");
//       setLoadingDescription(false);
//     }
//   }, []);

//   const handleDescriptionSave = async (description: string) => {
//     if (auth.currentUser) {
//       try {
//         const userRef = doc(db, "users", auth.currentUser.email as string);
//         await updateDoc(userRef, {
//           desc: description,
//         });
//         setUserDescription(description);
//         showToast("success", `updated user description.`);
//       } catch (err) {
//         console.log(err);
//         showToast("error", "error updating user description.");
//       }
//     }
//   };

//   const [selectedRole, setSelectedRole] = useState("");
//   const [userType, setUserType] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (auth.currentUser) {
//         const userEmail = auth.currentUser.email;
//         if (userEmail) {
//           const userRef = doc(db, "users", userEmail);
//           try {
//             const docSnap = await getDoc(userRef);
//             if (docSnap.exists()) {
//               const userData = docSnap.data();
//               setUserType(userData.userType || ""); // Use an empty string if userType is not set
//             } else {
//               console.log("No such document!");
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//           } finally {
//             setLoadingUserType(false); // This ensures we stop the spinner regardless
//           }
//         } else {
//           console.log("User email is null or undefined.");
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedRole(event.target.value);
//   };

//   const handleUserTypeSave = async () => {
//     if (auth.currentUser && selectedRole) {
//       try {
//         const userRef = doc(db, "users", auth.currentUser.email as string);
//         await updateDoc(userRef, {
//           userType: selectedRole,
//         });
//         setUserType(selectedRole);
//         showToast("success", `updated user type to ${selectedRole}`);
//         console.log(`User type updated to ${selectedRole}`);
//       } catch (err) {
//         console.error("Error updating user type:", err);
//         showToast("error", "error updating user type");
//       }
//     }
//   };

//   return (
//     <>
//       {/* Header */}
//       <div className="head">
//         <Heading>Your Account</Heading>
//       </div>
//       <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

//       {/* Body */}
//       <div className="body">
//         {/* Profile Picture */}
//         {/* Profile Picture Section */}
//         <Flex
//           direction={{ base: "column", md: "row" }}
//           align="center"
//           justify="space-between"
//           wrap="wrap"
//           my={4}
//         >
//           {/* Avatar */}
//           <Avatar
//             src={avatarUrl}
//             size="xl"
//             mb={{ base: 4, md: 0 }}
//             mr={{ md: 6 }}
//           />

//           {/* Text and Button */}
//           <Flex
//             direction={{ base: "column", md: "row" }}
//             align="center"
//             justify="space-between"
//             flex="1"
//             minW="0" // Prevents flex items from overflowing
//           >
//             <Text fontSize="lg" textAlign="left" my={{ base: 2, md: 0 }}>
//               Update your profile photo
//             </Text>
//             <Button
//               size="sm"
//               colorScheme="purple"
//               onClick={() => document.getElementById("file-upload")?.click()}
//             >
//               Upload
//             </Button>
//           </Flex>

//           {/* Hidden Input for File Upload */}
//           <Input
//             type="file"
//             accept="image/*"
//             hidden
//             id="file-upload"
//             onChange={handleImageSelection}
//           />
//         </Flex>

//         {/* <Flex
//           direction={{ base: "column", md: "row" }}
//           wrap="wrap"
//           justify="center"
//           my={4}
//         >
//           <Avatar src={avatarUrl} size="xl" mb={{ base: 4, md: 0 }} />
//           <VStack align="start" flex="1">
//             <Text fontSize="lg">Update your profile photo</Text>
//             <Input
//               type="file"
//               accept="image/*"
//               hidden
//               id="file-upload"
//               onChange={handleImageSelection}
//             />
//             <Button
//               size="sm"
//               padding={{ base: "0.5rem", md: "1rem" }}
//               colorScheme="purple"
//               onClick={() => document.getElementById("file-upload")?.click()}
//             >
//               Upload
//             </Button>
//           </VStack>
//         </Flex> */}
//         {/* <Flex>
//           <Avatar
//             src={avatarUrl}
//             referrerPolicy="no-referrer"
//             className="avatar"
//           />
//           <Box className="upload-section">
//             <Box className="text">Update your profile photo</Box>
//             <Input
//               type="file"
//               accept="image/*"
//               hidden
//               id="file-upload"
//               onChange={handleImageSelection}
//             />
//             <Button
//               className="button button-upload"
//               colorScheme="purple"
//               size="sm"
//               onClick={() => document.getElementById("file-upload")?.click()}
//             >
//               Upload
//             </Button>
//           </Box>
//         </Flex>
//         <Divider borderColor="lightgrey" borderWidth="1px" maxW="" /> */}
//         {/* Display Name */}
//         <Box my={4}>
//           <Heading size="sm" mb={3}>
//             Display Name
//           </Heading>
//           <EditableTextField
//             b1="Edit"
//             initialValue={
//               auth.currentUser?.displayName
//                 ? auth.currentUser.displayName
//                 : "click on edit to set username"
//             }
//             onSave={handleUsernameSave}
//           />
//         </Box>
//         <Divider borderColor="lightgrey" borderWidth="1px" />
//         {/* Description */}
//         <Box my={4}>
//           <Heading size="sm" mb={3}>
//             Description
//           </Heading>
//           {loadingDescription ? (
//             <Spinner />
//           ) : (
//             <EditableTextField
//               b1="Edit"
//               initialValue={userDescription}
//               onSave={handleDescriptionSave}
//             />
//           )}
//         </Box>
//         <Divider borderColor="lightgrey" borderWidth="1px" />
//         {/* Role */}
//         <VStack spacing={4} align="stretch" my={4}>
//           <Heading size="sm">What are you using the app for?</Heading>
//           <Flex wrap="wrap">
//             {loadingUserType ? (
//               <Spinner />
//             ) : (
//               <Select
//                 placeholder="Select option"
//                 width="auto"
//                 flex="1"
//                 value={selectedRole || userType}
//                 onChange={handleRoleChange}
//               >
//                 <option value="teacher">Teacher</option>
//                 <option value="student">Student</option>
//                 <option value="creator">Creator</option>
//                 <option value="business">Small Business</option>
//                 <option value="personal">Personal</option>
//               </Select>
//             )}

//             <Button
//               size="sm"
//               fontWeight="500"
//               onClick={handleUserTypeSave}
//               ml="2rem"
//             >
//               Save Role
//             </Button>
//           </Flex>
//         </VStack>

//         {/* edited UI */}
//         {/* Display Name */}
//         {/* <VStack spacing={4} my={4} align="stretch">
//           <Heading size="sm" mb={3}>
//             Display Name
//           </Heading>
//           <Flex
//             direction={{ base: "column", sm: "row" }}
//             justify="space-between"
//             align={{ base: "flex-start", sm: "center" }}
//           >
//             <Text flex={1} mb={{ base: 2, sm: 0 }} textAlign="left">
//               {auth.currentUser?.displayName || "click on edit to set username"}
//             </Text>
//             <EditableTextField
//               b1="Edit"
//               initialValue={
//                 auth.currentUser?.displayName || "click on edit to set username"
//               }
//               onSave={handleUsernameSave}
//             />
//           </Flex>
//         </VStack>
//         <Divider borderColor="lightgrey" borderWidth="1px" /> */}

//         {/* Description Section */}
//         {/* <VStack spacing={4} my={4} align="stretch">
//           <Heading size="sm" mb={3}>
//             Description
//           </Heading>
//           {loadingDescription ? (
//             <Spinner />
//           ) : (
//             <Flex
//               direction={{ base: "column", sm: "row" }}
//               justify="space-between"
//               align={{ base: "flex-start", sm: "center" }}
//             >
//               <Text flex={1} mb={{ base: 2, sm: 0 }} textAlign="left">
//                 {userDescription || "You have not set a description yet."}
//               </Text>
//               <EditableTextField
//                 b1="Edit"
//                 initialValue={userDescription}
//                 onSave={handleDescriptionSave}
//               />
//             </Flex>
//           )}
//         </VStack>
//         <Divider borderColor="lightgrey" borderWidth="1px" /> */}

//         {/* Role Section */}
//         {/* <VStack spacing={4} my={4} align="stretch">
//           <Heading size="sm">What are you using the app for?</Heading>
//           {loadingUserType ? (
//             <Spinner />
//           ) : (
//             <Flex
//               direction={{ base: "column", sm: "row" }}
//               justify="space-between"
//               align={{ base: "flex-start", sm: "center" }}
//               mb={{ base: 2, sm: 0 }}
//             >
//               <Select
//                 placeholder="Select option"
//                 value={selectedRole || userType}
//                 onChange={handleRoleChange}
//                 // maxWidth={{ base: "100%", sm: "240px" }}
//                 // flexShrink={0}
//                 // mr={4}
//                 flex={1}
//                 size="sm"
//                 mb={{ base: 2, sm: 0 }}
//               >
//                 <option value="teacher">Teacher</option>
//                 <option value="student">Student</option>
//                 <option value="creator">Creator</option>
//                 <option value="business">Small Business</option>
//                 <option value="personal">Personal</option>
//               </Select>
//               <Spacer />
//               <Button
//                 size="sm"
//                 fontWeight="500"
//                 onClick={handleUserTypeSave}
//                 // w={{ base: "full", md: "auto" }}
//                 // mt={{ base: 2, md: 0 }}
//                 flexShrink={0}
//               >
//                 Save Role
//               </Button>
//             </Flex>
//           )}
//         </VStack> */}

//         {/* Display Name */}
//         {/* <VStack spacing={4} my={4}>
//           <Heading size="sm" mb={3}>
//             Display Name
//           </Heading>
//           <Grid templateColumns="1fr auto" gap={6}>
//             <EditableTextField
//               b1="Edit" // Adjust the prop name according to your component
//               initialValue={
//                 auth.currentUser?.displayName || "click on edit to set username"
//               }
//               onSave={handleUsernameSave}
//             />
//           </Grid>
//         </VStack>
//         <Divider borderColor="lightgrey" borderWidth="1px" /> */}

//         {/* Description Section */}
//         {/* <VStack spacing={4} my={4}>
//           <Heading size="sm" mb={3}>
//             Description
//           </Heading>
//           <Grid templateColumns="1fr auto" gap={6}>
//             {loadingDescription ? (
//               <Spinner />
//             ) : (
//               <Grid templateColumns="1fr auto" gap={4} alignItems="center">
//                 <EditableTextField
//                   b1="Edit"
//                   initialValue={userDescription}
//                   onSave={handleDescriptionSave}
//                 />
//               </Grid>
//             )}
//           </Grid>
//         </VStack>
//         <Divider borderColor="lightgrey" borderWidth="1px" /> */}

//         {/* Role */}
//         {/* <VStack spacing={4} my={4}>
//           <Heading size="sm">What are you using the app for?</Heading>
//           <Grid templateColumns="1fr auto" gap={6}>
//             {loadingUserType ? (
//               <Spinner />
//             ) : (
//               <Grid templateColumns="1fr auto" gap={4} alignItems="center">
//                 <Select
//                   placeholder="Select option"
//                   value={selectedRole || userType}
//                   onChange={handleRoleChange}
//                   width="full" // use the 'full' keyword to take up all available width
//                 >
//                   <option value="teacher">Teacher</option>
//                   <option value="student">Student</option>
//                   <option value="creator">Creator</option>
//                   <option value="business">Small Business</option>
//                   <option value="personal">Personal</option>
//                 </Select>
//                 <Button
//                   size="sm"
//                   fontWeight="500"
//                   onClick={handleUserTypeSave}
//                   // useBreakpointValue hook to dynamically set margins based on current breakpoint
//                   ml={{ base: "0", md: "2rem" }}
//                   mt={{ base: "1rem", md: "0" }}
//                   width={{ base: "full", md: "auto" }}
//                 >
//                   Save Role
//                 </Button>
//               </Grid>
//             )}
//           </Grid>
//         </VStack> */}
//       </div>
//       {/* <Divider borderColor="lightgrey" borderWidth="1px" maxW="" /> */}
//     </>
//   );
// };

// export default Account;

import "./settings.css";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  VStack,
} from "@chakra-ui/react";
import EditableTextField from "./sub-components/EditableTextField";
import { useEffect, useState } from "react";
// import { sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { UseToastNotification } from "../../utils/UseToastNotification";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Account = () => {

  const [selectedRole, setSelectedRole] = useState('');
  const [userType, setUserType] = useState('');
  const [userDescription, setUserDescription] = useState<string>('Write about yourself !');
  const [loadingDescription, setLoadingDescription] = useState<boolean>(true);
  const [loadingUserType, setLoadingUserType] = useState<boolean>(true);
  const [loadingUserVisibility, setLoadingUserVisibility] = useState<boolean>(true);
  const [userVisibility, setUserVisibility] = useState<boolean>(true);  // true means public and false private.

  const showToast = UseToastNotification();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [avatarUrl, setAvatarUrl] = useState(auth.currentUser?.photoURL || "");

  const handleImageSelection = async (event: any) => {
    const file = event.target.files[0];
    if (file && auth.currentUser) {
      // Use the file to show a preview to the user
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl); // Update the state variable for preview
      showToast("success", `updated User profile pic.`);

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
          photoURL: permanentUrl,
        });

        // Update the Firestore document
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          photoURL: permanentUrl,
        });

        console.log("Profile photo updated successfully");

        // Update the avatarUrl state with the permanent URL for further use
        setAvatarUrl(permanentUrl);

        // Clean up the preview URL as it's no longer needed
        URL.revokeObjectURL(previewUrl);
      } catch (err) {
        console.error("Error updating profile photo:", err);
        showToast("error", "error updating profile photo.");
      }
    }
  };

  const handleUsernameSave = async (newUsername: string) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newUsername,
        });
        // TODO: handle database update here
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          displayName: newUsername,
        });

        showToast("success", `updated username to ${newUsername}`);
      } catch (err) {
        console.error(err);
        showToast("error", "error updating username.");
      }
    }
  };



  useEffect(() => {
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;
      if (userEmail) {
        const userRef = doc(db, "users", userEmail);
        getDoc(userRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              if (userData && userData.desc) {
                setUserDescription(userData.desc);
              } else {
                setUserDescription("You have not set a description yet.");
              }
            } else {
              setUserDescription("You have not set a description yet.");
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
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          desc: description,
        });
        setUserDescription(description);
        showToast("success", `updated user description.`);
      } catch (err) {
        console.log(err);
        showToast("error", "error updating user description.");
      }
    }
  };



  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userEmail = auth.currentUser.email;
        if (userEmail) {
          const userRef = doc(db, "users", userEmail);
          try {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setUserType(userData.userType || ''); // Use an empty string if userType is not set
              setUserVisibility(userData.userVisibility === 'public'); // Set based on the userVisibility field from Firestore
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoadingUserType(false); // This ensures we stop the spinner regardless
            setLoadingUserVisibility(false);
            setLoadingUserVisibility(false);
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
          userType: selectedRole,
        });
        setUserType(selectedRole);
        showToast("success", `updated user type to ${selectedRole}`);
        console.log(`User type updated to ${selectedRole}`);
      } catch (err) {
        console.error("Error updating user type:", err);
        showToast("error", "error updating user type");
      }
    }
  };

  const handleVisibilityChange = (value: string) => {
    setUserVisibility(value === 'public');
  };

  const saveUserVisibility = async () => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          userVisibility: userVisibility ? 'public' : 'private'
        });
        showToast('success', `Visibility set to ${userVisibility ? 'public' : 'private'}`);
      } catch (error) {
        console.error("Error updating visibility:", error);
        showToast('error', 'Error updating visibility');
      }
    }
  };

  const navigate = useNavigate(); // Hook for navigation

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };




  return (
    <>
      {/* Header */}
      <div className="head">
        <Heading>Your Account</Heading>
        <Button
        size="sm"
        leftIcon={<ArrowBackIcon />}
        onClick={goBack}
      >
        Go back
      </Button>
      </div>
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

      {/* Body */}
      <div className="body">
        {/* Profile Picture */}
        <Flex>
          <Avatar
            src={avatarUrl}
            referrerPolicy="no-referrer"
            className="avatar"
          />
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
              onClick={() => document.getElementById("file-upload")?.click()}
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
            initialValue={
              auth.currentUser?.displayName
                ? auth.currentUser.displayName
                : "click on edit to set username"
            }
            onSave={handleUsernameSave}
          />
        </Box>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Description */}
        <Box my={4}>
          <Heading size="sm" mb={3}>
            Description
          </Heading>
          {loadingDescription ? (
            <Spinner />
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
            {loadingUserType ? (
              <Spinner />
            ) : (
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
            )}

            <Button
              size="sm"
              fontWeight="500"
              onClick={handleUserTypeSave}
              ml="2rem"
            >
              Save Role
            </Button>
          </Flex>
        </VStack>

        {/* user visibility    */}

        <VStack spacing={4} align="stretch" my={4}>
          <Heading size="sm">Set user visibility</Heading>
          <Flex>
            {loadingUserVisibility ? (
              <Spinner />
            ) : (
              <RadioGroup
                onChange={handleVisibilityChange}
                value={userVisibility ? "public" : "private"}
              >
                <Stack direction="row">
                  <Radio value="public" defaultChecked={userVisibility}>
                    Public
                  </Radio>
                  <Radio value="private">Private</Radio>
                </Stack>
              </RadioGroup>
            )}

            <Button
              size="sm"
              fontWeight="500"
              onClick={saveUserVisibility}
              ml="2rem"
            >
              Save Visibility
            </Button>
          </Flex>
        </VStack>
      </div >

    </>
  );
};

export default Account;
