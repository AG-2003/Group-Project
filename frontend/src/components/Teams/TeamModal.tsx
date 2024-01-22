// import React, { useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "../../firebase-config";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import {
//   Flex,
//   Heading,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Text,
//   Input,
//   Textarea,
//   Select,
//   Link,
// } from "@chakra-ui/react";
// import {
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";

// interface TeamData {
//   id: string;
//   name: string;
//   description: string;
//   role: string;
//   members: string[];
//   image: string | null; // Store image URL instead of File
// }

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const TeamModal: React.FC<Props> = ({ isOpen, onClose }: Props) => {
//   const [teamName, setTeamName] = useState("");
//   const [teamDescription, setTeamDescription] = useState("");
//   const [teamRole, setTeamRole] = useState("");
//   const [emailInputs, setEmailInputs] = useState([""]);
//   const [image, setImage] = useState<File | null>(null); // State to store the selected image
//   const [page, setPage] = useState(1);
//   const [user] = useAuthState(auth);

//   const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setTeamName(event.target.value);
//   };

//   const handleTeamDescriptionChange = (
//     event: React.ChangeEvent<HTMLTextAreaElement>
//   ) => {
//     setTeamDescription(event.target.value);
//   };

//   const handleTeamRoleChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setTeamRole(event.target.value);
//   };

//   const handleEmailInputChange = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const newEmailInputs = [...emailInputs];
//     newEmailInputs[index] = event.target.value;
//     setEmailInputs(newEmailInputs);
//   };

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setImage(event.target.files[0]);
//     }
//   };

//   const handleNextPage = () => {
//     if (page === 1) {
//       setPage(page + 1);
//     } else {
//       saveTeamToFirestore();
//       onClose(); // Close the modal when saving is complete
//     }
//   };

//   const handlePreviousPage = () => {
//     setPage(page - 1);
//   };

//   const handleAddInvitation = () => {
//     setEmailInputs((prevEmails) => [...prevEmails, ""]);
//   };

//   const saveTeamToFirestore = async () => {
//     try {
//       const username = user?.email;
//       if (username) {
//         const userDocRef = doc(db, "users", username);
//         const docSnapshot = await getDoc(userDocRef);
//         let teamsArray: TeamData[] = [];

//         if (docSnapshot.exists()) {
//           teamsArray = docSnapshot.data().teams || [];
//         }

//         const newTeam: TeamData = {
//           id: teamName.toLowerCase().replace(/\s+/g, "-"),
//           name: teamName,
//           description: teamDescription,
//           role: teamRole,
//           members: emailInputs.filter((email) => email.trim() !== ""),
//           image: null, // Initialize with null value
//         };

//         if (image) {
//           // If an image is selected, upload it to Firebase Storage
//           const storage = getStorage();
//           const storagePath = `teamImages/${teamName
//             .toLowerCase()
//             .replace(/\s+/g, "-")}/${image.name}`;
//           const imageRef = storageRef(storage, storagePath);
//           const snapshot = await uploadBytes(imageRef, image);

//           // Get the download URL and update newTeam
//           const teamImageUrl = await getDownloadURL(snapshot.ref);
//           newTeam.image = teamImageUrl;
//         }

//         const existingTeamIndex = teamsArray.findIndex(
//           (team: TeamData) => team.id === newTeam.id
//         );

//         if (existingTeamIndex !== -1) {
//           teamsArray[existingTeamIndex] = newTeam;
//         } else {
//           teamsArray.push(newTeam);
//         }

//         await setDoc(
//           userDocRef,
//           {
//             teams: teamsArray,
//           },
//           { merge: true }
//         );
//         console.log("Team saved successfully");
//       }
//     } catch (error) {
//       console.error("Error saving team:", error);
//     }
//   };

//   const renderModalContent = () => {
//     switch (page) {
//       case 1:
//         return (
//           <>
//             <Heading>Create your own team</Heading>
//             <Text mb={4} marginTop={5}>
//               Team Name
//             </Text>
//             <Input
//               mb={4}
//               placeholder="Name"
//               value={teamName}
//               onChange={handleTeamNameChange}
//             />
//             <Text mb={4}>Team Description</Text>
//             <Textarea
//               mb={4}
//               placeholder="Description"
//               value={teamDescription}
//               onChange={handleTeamDescriptionChange}
//             />
//             <Text mb={4}>Your Role</Text>
//             <Select
//               mb={4}
//               placeholder="Choose a role"
//               value={teamRole}
//               onChange={handleTeamRoleChange}
//             >
//               <option value="teacher">Teacher</option>
//               <option value="educator">Educator</option>
//               <option value="business">Business</option>
//               <option value="creator">Creator</option>
//             </Select>
//             <Text mb={4}>Team Image</Text>
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               mb={4}
//             />
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <Heading>Invite your team</Heading>
//             <Text mb={4} marginTop={5} marginBottom={5}>
//               Bring your whole team to collaborate on your projects.
//             </Text>
//             <Link mb={4} onClick={() => console.log("Get invite link clicked")}>
//               <Flex align="center" mb={5}>
//                 Get invite link
//               </Flex>
//             </Link>
//             {emailInputs.map((email, index) => (
//               <Input
//                 key={index}
//                 mb={4}
//                 placeholder="Enter email address"
//                 value={email}
//                 onChange={(e) => handleEmailInputChange(index, e)}
//               />
//             ))}
//             <Text
//               color="blue.500"
//               cursor="pointer"
//               mb={4}
//               onClick={handleAddInvitation}
//             >
//               Add Invitation
//             </Text>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>
//           {page === 1 ? "Create your own team" : "Invite your team"}
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>{renderModalContent()}</ModalBody>
//         <ModalFooter>
//           {page !== 1 && (
//             <Button colorScheme="blue" mr={3} onClick={handlePreviousPage}>
//               Previous
//             </Button>
//           )}
//           <Button colorScheme="blue" onClick={handleNextPage}>
//             {page === 1 ? "Next" : "Finish"}
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default TeamModal;

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
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
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface TeamData {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
  image: string | null; // Store image URL instead of File
  chatId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TeamModal: React.FC<Props> = ({ isOpen, onClose }: Props) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [emailInputs, setEmailInputs] = useState([""]);
  const [image, setImage] = useState<File | null>(null); // State to store the selected image
  const [page, setPage] = useState(1);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleNextPage = () => {
    if (page === 1) {
      setPage(page + 1);
    } else {
      saveTeamToFirestore();
      onClose(); // Close the modal when saving is complete
    }
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleAddInvitation = () => {
    setEmailInputs((prevEmails) => [...prevEmails, ""]);
  };

  // const saveTeamToFirestore = async () => {
  //   try {
  //     // get the user
  //     const username = user?.email;

  //     // create the team
  //     if (username) {
  //       const newTeam: TeamData = {
  //         id: teamName.toLowerCase().replace(/\s+/g, "-93217"),
  //         name: teamName,
  //         description: teamDescription,
  //         role: teamRole,
  //         members: emailInputs.filter((email) => email.trim() !== ""),
  //         image: null, // Initialize with null value
  //       };

  //       // go to the firestore and into the collection "teams" and into that specific team
  //       const teamDocRef = doc(db, "teams", newTeam.id);

  //       // go to the firstore and into the collection users and into that specific user
  //       const DocRef = doc(db, "users", username);

  //       // wait for response
  //       const docSnapshot = await getDoc(teamDocRef);
  //       const userDocSnapshot = await getDoc(DocRef);

  //       // create a team array to store the team
  //       let teamsArray: Array<TeamData> = [];

  //       let teamID = newTeam.id;

  //       if (docSnapshot.exists()) {
  //         teamsArray = docSnapshot.data().teams || [];
  //       }

  //       if (userDocSnapshot.exists()) {
  //         teamID = userDocSnapshot.data().teams || [];
  //       }

  //       if (image) {
  //         // If an image is selected, upload it to Firebase Storage
  //         const storage = getStorage();
  //         const storagePath = `teamImages/${teamName
  //           .toLowerCase()
  //           .replace(/\s+/g, "-")}/${image.name}`;
  //         const imageRef = storageRef(storage, storagePath);
  //         const snapshot = await uploadBytes(imageRef, image);

  //         // Get the download URL and update newTeam
  //         const teamImageUrl = await getDownloadURL(snapshot.ref);
  //         newTeam.image = teamImageUrl;
  //       }

  //       const existingTeamIndex = teamsArray.findIndex(
  //         (team: TeamData) => team.id === newTeam.id
  //       );

  //       if (existingTeamIndex !== -1) {
  //         teamsArray[existingTeamIndex] = newTeam;
  //       } else {
  //         teamsArray.push(newTeam);
  //       }

  //       await setDoc(
  //         teamDocRef,
  //         {
  //           teams: teamsArray,
  //         },
  //         { merge: true }
  //       );

  //       await setDoc(
  //         DocRef,
  //         {
  //           teams: teamID,
  //         },
  //         { merge: true }
  //       );

  //       console.log("Team saved successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error saving team:", error);
  //   }
  // };

  const saveTeamToFirestore = async () => {
    try {
      // get the user
      const username = user?.email;
      const chatID = teamName.toLowerCase().replace(/\s+/g, "-163146");

      // create the team
      if (username) {
        const newTeam: TeamData = {
          id: teamName.toLowerCase().replace(/\s+/g, "-93217"),
          name: teamName,
          description: teamDescription,
          role: teamRole,
          members: emailInputs.filter((email) => email.trim() !== ""),
          image: null, // Initialize with null value
          chatId: chatID,
        };

        // go to the firestore and into the collection "teams" and into that specific team
        const teamDocRef = doc(db, "teams", newTeam.id);

        // go to the firstore and into the collection users and into that specific user
        const DocRef = doc(db, "users", username);

        // go to the firestore and into collection "teamsChat" and into that specific chat
        const chatDocRef = doc(db, "teamsChat", newTeam.chatId);

        // wait for response
        const docSnapshot = await getDoc(teamDocRef);
        const userDocSnapshot = await getDoc(DocRef);

        if (docSnapshot.exists()) {
          console.error("Team ID already exists");
          return;
        }

        // Save the team data in the team document
        await setDoc(teamDocRef, newTeam);

        // Save the team ID in the user document
        await updateDoc(DocRef, {
          teams: [...(userDocSnapshot.data()?.teams || []), newTeam.id],
        });

        await setDoc(chatDocRef, { messages: [] });

        // for invite
        for (const email of newTeam.members) {
          const memberDocRef = doc(db, "users", email);
          const memberDocSnapshot = await getDoc(memberDocRef);

          if (memberDocSnapshot.exists()) {
            // Add the team to the user's teams array
            await updateDoc(memberDocRef, {
              teams: [...(memberDocSnapshot.data()?.teams || []), newTeam.id],
            });
          }
        }

        if (image) {
          // If an image is selected, upload it to Firebase Storage
          const storage = getStorage();
          const storagePath = `teamImages/${teamName
            .toLowerCase()
            .replace(/\s+/g, "-")}/${image.name}`;
          const imageRef = storageRef(storage, storagePath);
          const snapshot = await uploadBytes(imageRef, image);

          // Get the download URL and update newTeam
          const teamImageUrl = await getDownloadURL(snapshot.ref);
          newTeam.image = teamImageUrl;

          // Update the team document with the image URL
          await updateDoc(teamDocRef, {
            image: teamImageUrl,
          });
        }

        console.log("Team saved successfully");
      }
    } catch (error) {
      console.error("Error saving team:", error);
    }
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
            <Text mb={4}>Team Image</Text>
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

export default TeamModal;
