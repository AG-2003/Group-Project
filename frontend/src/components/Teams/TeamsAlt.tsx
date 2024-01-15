// import React, { useState } from "react";
// import {
//   Box,
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
//   Spacer,
// } from "@chakra-ui/react";
// import { FaPlusCircle } from "react-icons/fa";

// interface Props {
//   onButtonClick: (arg: string) => void;
// }

// const CreateTeamModal = ({ isOpen, onClose }) => {
//   const [page, setPage] = useState(1);
//   const [emailInputs, setEmailInputs] = useState([""]); // State to manage email inputs

//   const handleNextPage = () => {
//     if (page === 1) {
//       setPage(page + 1);
//     } else {
//       onClose();
//       setPage(page - 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     setPage(page - 1);
//   };

//   const handleAddInvitation = () => {
//     setEmailInputs((prevEmails) => [...prevEmails, ""]);
//   };

//   const handleEmailInputChange = (index, value) => {
//     setEmailInputs((prevEmails) => {
//       const updatedEmails = [...prevEmails];
//       updatedEmails[index] = value;
//       return updatedEmails;
//     });
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
//             <Input mb={4} placeholder="Name" />
//             <Text mb={4}>Team Description</Text>
//             <Textarea mb={4} placeholder="Description" />
//             <Text mb={4}>Your Role</Text>
//             <Select mb={4} placeholder="Choose a role">
//               <option value="teacher">Teacher</option>
//               <option value="educator">Educator</option>
//               <option value="business">Business</option>
//               <option value="creator">Creator</option>
//             </Select>
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
//                 onChange={(e) => handleEmailInputChange(index, e.target.value)}
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
//         <ModalHeader>{page === 1 ? "Create Team" : "Invite Team"}</ModalHeader>
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

// const TeamsPage = ({ onButtonClick }: Props) => {
//   const handleClick = (component: string) => {
//     onButtonClick(component);
//   };

//   const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);

//   const handleCreateTeamClick = () => {
//     setCreateTeamModalOpen(true);
//   };

//   const handleCloseCreateTeamModal = () => {
//     setCreateTeamModalOpen(false);
//   };

//   return (
//     <Flex direction="column" height="100vh" p={8}>
//       {/* Section 1: Join or Create a Team */}
//       <Box mb={8}>
//         <Heading as="h2" size="xl">
//           Join or Create a Team
//         </Heading>
//       </Box>
//       <Flex>
//         {/* Create a Team button */}
//         <Box flex="1" textAlign="center">
//           <Box
//             bg="blue.500"
//             color="white"
//             p={4}
//             borderRadius="lg"
//             cursor="pointer"
//             width="170px"
//             height="150px"
//             _hover={{ bg: "blue.900" }}
//             textAlign="center"
//             onClick={handleCreateTeamClick}
//           >
//             <FaPlusCircle size={32} />
//             <Heading size="md" mt={2}>
//               Create a Team
//             </Heading>
//           </Box>
//         </Box>

//         {/* Join a Team button */}
//         <Box flex="1" textAlign="center">
//           <Box
//             bg="green.500"
//             color="white"
//             p={4}
//             borderRadius="lg"
//             cursor="pointer"
//             width="170px"
//             height="150px"
//             _hover={{ bg: "green.900" }}
//           >
//             <FaPlusCircle size={32} />
//             <Heading size="md" mt={2}>
//               Join a Team
//             </Heading>
//           </Box>
//         </Box>
//       </Flex>

//       {/* Margin between sections */}
//       <Box mt={8} />

//       {/* Section 2: Your Teams */}
//       <Box>
//         <Heading as="h2" size="xl">
//           Your Teams
//         </Heading>
//         <Box
//           bg="blue.500"
//           color="white"
//           p={4}
//           borderRadius="lg"
//           cursor="pointer"
//           width="170px"
//           height="150px"
//           _hover={{ bg: "blue.900" }}
//           textAlign="center"
//           onClick={() => {
//             onButtonClick("inTeam");
//           }}
//         />
//       </Box>

//       {/* Create Team Modal */}
//       <CreateTeamModal
//         isOpen={isCreateTeamModalOpen}
//         onClose={handleCloseCreateTeamModal}
//       />
//     </Flex>
//   );
// };

// export default TeamsPage;

import React from "react";

const TeamsAlt = () => {
  return <div>TeamsAlt</div>;
};

export default TeamsAlt;
