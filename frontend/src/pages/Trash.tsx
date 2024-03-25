import React, { useEffect, useState } from "react";
import {
  Divider,
  Box,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Flex,
  useDisclosure,
  Grid,
  GridItem,
  Text
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Dashboard/Navbar";
import SideBar from "../components/Dashboard/sidebar";
import { SuiteData } from "../interfaces/SuiteData";
import { FaTrash } from "react-icons/fa";
import { auth, db } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { DocumentData, DocumentReference, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { MdRestore } from "react-icons/md";
import { UseToastNotification } from "../utils/UseToastNotification";
import TrashBg from "../assets/TrashBg.png";
import ArchiveBg from "../assets/Archive.png";
import ShareDoc from "../assets/sharedoc.png"
import "./Trash.scss";

interface Project {
  id: string;
  type: string;
  isShared: boolean;
}

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<SuiteData[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SuiteData[]>([]);
  const [currentProjectToDelete, setCurrentProjectToDelete] = useState<Project>(
    { id: "", type: "", isShared: false }
  );
  const [user] = useAuthState(auth);
  const showToast = UseToastNotification()
  const [toastShown, setToastShown] = useState(false);

  // Variants for Framer Motion animation
  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchProjects = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      const sharedDocsRef = collection(db, "sharedDocs")
      const sharedBoardsRef = collection(db, "sharedBoards")

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userDocuments: SuiteData[] = userData.documents || [];
        const userSheets: SuiteData[] = userData.sheets || [];
        const userWhiteboards: SuiteData[] = userData.boards || [];
        const userPowerpoints: SuiteData[] = userData.powerpoints || [];

        // Use the existing lastEdited field from Firestore data, don't generate a new one
        let combinedProjects: SuiteData[] = [
          ...userDocuments,
          ...userSheets,
          ...userWhiteboards,
          ...userPowerpoints,
        ];

        combinedProjects = combinedProjects.filter(
          (project: SuiteData) => project.isTrash
        );

        setProjects(combinedProjects);

        if(user?.email){
          // Fetch shared documents and shared boards
          const sharedDocsSnapshot = await getDocs(sharedDocsRef);
          const sharedBoardsSnapshot = await getDocs(sharedBoardsRef);

          // Filter shared documents and shared boards based on the user's email
          const filteredSharedDocs = sharedDocsSnapshot.docs.filter(doc => {
            const docData = doc.data() as SuiteData; // Replace YourDocumentType with the actual type
            return docData.owner === user.email && docData.isTrash === true;
          }).map(doc => doc.data() as SuiteData);
          const filteredSharedBoards = sharedBoardsSnapshot.docs.filter(doc => {
            const docData = doc.data() as SuiteData; // Replace YourDocumentType with the actual type
            return docData.owner === user.email && docData.isTrash === true;
          }).map(doc => doc.data() as SuiteData);

          setSharedProjects([...filteredSharedDocs, ...filteredSharedBoards]);
        }
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  useEffect(() => {
    const deleteOldProjects = async () => {
      const currentDate = new Date();
      const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 days

      const projectsToDelete = projects.filter((project) => {
        const projectDate = new Date(project.lastEdited);
        const timeDifference = currentDate.getTime() - projectDate.getTime();
        return timeDifference >= thirtyDaysInMilliseconds;
      });

      for (const project of projectsToDelete) {
        await handleTrashIconClick(project.id, project.type);
      }

      // If any projects were deleted, fetch the updated list of projects
      if (projectsToDelete.length > 0) {
        fetchProjects();
      }
    };

    deleteOldProjects();
    // Add dependencies to the useEffect if there are any other variables that should trigger this effect
  }, [projects]);

  useEffect(() => {
    if (!toastShown) {
       showToast("info", "Projects here shall remain for 30 days before permanent deletion.");
       setToastShown(true);
    }
   }, [toastShown]);

  const stripHtml = (html: string): string => {
    // Create a new div element and set its innerHTML to the HTML string
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    // Retrieve the text content from the div, which will be the plain text without HTML tags
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  };

  const formatDate = (dateString: string): string => {
    const date: Date = new Date(dateString);
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1; // Month is 0-indexed
    const year: number = date.getFullYear();

    // Convert 24hr time to 12hr time and set am/pm
    const hours12: number = hours % 12 || 12; // Convert hour to 12-hour format
    const amPm: string = hours < 12 ? "AM" : "PM";

    // Format minutes to always be two digits
    const formattedMinutes: string | number =
      minutes < 10 ? `0${minutes}` : minutes;

    // Format the date string
    return `${hours12}:${formattedMinutes} ${amPm}, ${day}/${month}/${year}`;
  };

  const handleTrashIconClick = async (
    id: string,
    type: string
  ): Promise<void> => {
    const userEmail = user?.email;
    if (userEmail) {
      try {
        const userDocRef = doc(db, "users", userEmail);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const suiteTypePlural = `${type}s`; // Convert type to plural (e.g., 'document' to 'documents')
          let suitesArray: SuiteData[] = userData[suiteTypePlural] || [];
          suitesArray = suitesArray.filter(
            (suite: SuiteData) => suite.id !== id
          ); // Remove the suite from the array

          // Update the user's document with the new suites array
          await setDoc(
            userDocRef,
            { [suiteTypePlural]: suitesArray },
            { merge: true }
          );
          fetchProjects();
        }
      } catch (error) {
        console.error("Error deleting suite:", error);
      }
    }
  };

  const handleSharedTrashIconClick = async (
    id: string,
    type: string
    ) => {
      let sharedDocRef: DocumentReference<DocumentData, DocumentData>
      if(type === 'document') {
        sharedDocRef = doc(db, "sharedDocs", id)
      } else {
        sharedDocRef = doc(db, "sharedBoards", id)
      }

      try {
        // Delete the document
        await deleteDoc(sharedDocRef);
        console.log("Document successfully deleted!");
     } catch (error) {
        console.error("Error deleting document: ", error);
     }
  }

  const handleRecoveryIconClick = async (
    id: string,
    type: string,
    isShared: boolean
  ): Promise<void> => {
    const userEmail = user?.email;
    if (userEmail) {
      if(!isShared){
        try {
          const userDocRef = doc(db, "users", userEmail);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const suiteTypePlural = `${type}s`; // Convert type to plural (e.g., 'document' to 'documents')
            const suitesArray: SuiteData[] = userData[suiteTypePlural] || [];
            const suiteIndex = suitesArray.findIndex(
              (suite: SuiteData) => suite.id === id
            );

            if (suiteIndex !== -1) {
              suitesArray[suiteIndex].isTrash = false; // Set isTrash to false for the suite

              // Update the user's document with the new suites array
              await setDoc(
                userDocRef,
                { [suiteTypePlural]: suitesArray },
                { merge: true }
              );
              setCurrentProjectToDelete({ id: "", type: "", isShared: false });
            }
          }
        } catch (error) {
          console.error("Error moving suite to trash:", error);
        }
      } else {
        try{
          let sharedDocRef: DocumentReference<DocumentData, DocumentData>
          if(type === 'document') {
            sharedDocRef = doc(db, "sharedDocs", id)
          } else {
            sharedDocRef = doc(db, "sharedBoards", id)
          }

          if(sharedDocRef) {
            const docSnapshot = await getDoc(sharedDocRef)

            if(docSnapshot.exists()){
              // Fetch the document data
              const docData = docSnapshot.data() as SuiteData;

              // Check if the user's email matches the 'owner' property of the document
              if(docData && docData.owner === user.email) {
                // If the condition is met, update the isTrash property to true
                await setDoc(sharedDocRef, { isTrash: false }, { merge: true });
              } else {
                console.log("User is not the owner of this document.");
              }
            }
          }
        } catch (error) {
          console.error("Error moving suite to recovery:", error);
        }
      }
    }

    fetchProjects();
  };

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const {
    isOpen: isShareModalOpen,
    onOpen: openSharedModal,
    onClose: closeSharedModal,
  } = useDisclosure();

  const setCurrentProjectState = (id: string, type: string, isShared: boolean) => {
    setCurrentProjectToDelete({ id: id, type: type, isShared: isShared });
  };

  const handleConfirmClick = () => {
    // Perform your logic here
    if(!currentProjectToDelete.isShared){
      handleTrashIconClick(
        currentProjectToDelete["id"],
        currentProjectToDelete["type"]
      );
    } else {
      handleSharedTrashIconClick(
        currentProjectToDelete["id"],
        currentProjectToDelete["type"]
      );
    }
    // Access the current project using 'currentProjectToDelete'
    console.log("Confirmed for project:", currentProjectToDelete);

    fetchProjects();

    closeSharedModal();
  };

  useEffect(() => {
    // Code to run when the modal is opened
    if (!isModalOpen && !isShareModalOpen) {
      // Additional code to run when modal opens...
      setCurrentProjectToDelete({ id: "", type: "", isShared: false });
    }
  }, [isModalOpen, isShareModalOpen]);

  return (
    <>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                paddingTop: "10px",
                height: "inherit",
                backgroundColor: "#f4f1fa",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <SideBar />
            </motion.div>
          )}
        </AnimatePresence>
        <Box
          flexGrow={1}
          padding="10px"
          marginLeft={5}
          overflow="scroll"
          sx={{
              '&::-webkit-scrollbar': {
                width: '10px',
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-button': {
                display: 'none', // Hide scrollbar arrows
              },
              '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change this to the color you want
              },
              '&:hover': {
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 0, 0, 0.5) transparent', // Change this to the color you want
              },
          }}
          >
          <div className="tprojects-container">
            <h2 className="tprojects-heading">Recently Deleted</h2>
              {projects.length === 0 && sharedProjects.length===0 ? (
                <Box textAlign="center" mt="20px">
                  <img className="Image" src={TrashBg} alt="No Projects" />
                </Box>
              ) : (
                <>
                  <Grid templateColumns="repeat(auto-fit, max(300px))" gap={6}>
                    {projects.map((project) => (
                      <GridItem key={project.id} w="100%"  _hover={{transform: "translateY(-5px)", shadow: "lg"}}>
                        <Box
                          h="150px"
                          bgImage={`url(${ArchiveBg})`}
                          bgPosition="center"
                          bgRepeat="no-repeat"
                          bgSize="cover"
                          p={3}
                          borderTopLeftRadius="md"
                          borderTopRightRadius="md"
                          borderWidth="1px"
                          borderColor="gray.200"
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            bg="rgba(0, 0, 0, 0.6)"
                            position="absolute"
                            top="0"
                            right="0"
                            bottom="0"
                            left="0"
                            display="flex"
                            flexDirection="column"
                            justifyContent="end"
                            p={3}
                          >
                            <Text fontWeight="500" fontSize="1.2rem" color="white" noOfLines={1}>
                              {project.title}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              Last edited: {new Date(project.lastEdited).toLocaleString()}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              Type: {project.type}, unshared
                            </Text>
                          </Box>
                        </Box>
                        <Box // Container for icons
                          p={2}
                          backgroundColor="white" // Set the background to white
                          borderBottomLeftRadius="md"
                          borderBottomRightRadius="md"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        >
                          {/* Your IconButtons go here */}
                          <IconButton
                            icon={<Icon as={MdRestore} color="#484c6c" />}
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                            }}
                            transition="transform 0.3s ease-in-out"
                            _hover={{ transform: "scale(1.1)" }}
                            aria-label="Restore Project"
                            onClick={() => {
                              handleRecoveryIconClick(project.id, project.type, project.isShared);
                            }}
                          />
                          <IconButton
                            icon={<Icon as={FaTrash} color="#484c6c" />}
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                              marginRight: "8px", // Add margin to separate icons
                            }}
                            transition="transform 0.3s ease-in-out"
                            _hover={{ transform: "scale(1.1)" }}
                            aria-label="Delete Project"
                            onClick={() => {
                              openModal();
                              setCurrentProjectState(project.id, project.type, project.isShared);
                            }}
                          />
                        </Box>
                        <Modal
                          isOpen={isModalOpen}
                          onClose={closeModal}
                          blockScrollOnMount={false}
                          motionPreset="none"
                          isCentered
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              <ModalCloseButton onClick={closeModal} />
                            </ModalHeader>
                            <ModalBody>
                              <p className="popup-text">
                                Are you sure you would like to delete the project? This
                                action cannot be undone.
                              </p>
                            </ModalBody>
                            <ModalFooter>
                              <Flex justifyContent="space-between">
                                <Button
                                  colorScheme="red"
                                  flex="1"
                                  mr={2}
                                  onClick={handleConfirmClick}
                                >
                                  Confirm
                                </Button>
                                <Button flex="1" variant="outline" onClick={closeModal}>
                                  Deny
                                </Button>
                              </Flex>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </GridItem>
                    ))}
                  </Grid>
                  {/* // For shared Projects */}
                  <Grid templateColumns="repeat(auto-fit, max(300px))" gap={6} marginTop="5vh">
                    {sharedProjects.map((project: SuiteData) => (
                      <GridItem key={project.id} w="100%"  _hover={{transform: "translateY(-1px)", shadow: "lg"}}>
                        <Box
                          h="150px"
                          bgImage={`url(${ShareDoc})`}
                          bgPosition="center"
                          bgRepeat="no-repeat"
                          bgSize="cover"
                          p={3}
                          borderTopLeftRadius="md"
                          borderTopRightRadius="md"
                          borderWidth="1px"
                          borderColor="gray.200"
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            bg="rgba(0, 0, 0, 0.6)"
                            position="absolute"
                            top="0"
                            right="0"
                            bottom="0"
                            left="0"
                            display="flex"
                            flexDirection="column"
                            justifyContent="end"
                            p={3}
                          >
                            <Text fontWeight="500" fontSize="1.2rem" color="white" noOfLines={1}>
                              {project.title}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              Last edited: {new Date(project.lastEdited).toLocaleString()}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              Type: {project.type}, shared
                            </Text>
                          </Box>
                        </Box>
                        <Box // Container for icons
                          p={2}
                          backgroundColor="white" // Set the background to white
                          borderBottomLeftRadius="md"
                          borderBottomRightRadius="md"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        >
                          {/* Your IconButtons go here */}
                          <IconButton
                            icon={<Icon as={MdRestore} color="#484c6c" />}
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                            }}
                            transition="transform 0.3s ease-in-out"
                            _hover={{ transform: "scale(1.1)" }}
                            aria-label="Restore Project"
                            onClick={() => {
                              handleRecoveryIconClick(project.id, project.type, project.isShared);

                            }}
                          />
                          <IconButton
                            icon={<Icon as={FaTrash} color="#484c6c" />}
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                              marginRight: "8px", // Add margin to separate icons
                            }}
                            transition="transform 0.3s ease-in-out"
                            _hover={{ transform: "scale(1.1)" }}
                            aria-label="Delete Project"
                            onClick={() => {
                              openSharedModal();
                              setCurrentProjectState(project.id, project.type, project.isShared);
                            }}
                          />
                        </Box>
                        <Modal
                          isOpen={isShareModalOpen}
                          onClose={closeSharedModal}
                          blockScrollOnMount={false}
                          motionPreset="none"
                          isCentered
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              <ModalCloseButton onClick={closeSharedModal} />
                            </ModalHeader>
                            <ModalBody>
                              <p className="popup-text">
                                Are you sure you would like to delete the project? This
                                action cannot be undone.
                              </p>
                            </ModalBody>
                            <ModalFooter>
                              <Flex justifyContent="space-between">
                                <Button
                                  colorScheme="red"
                                  flex="1"
                                  mr={2}
                                  onClick={handleConfirmClick}
                                >
                                  Confirm
                                </Button>
                                <Button flex="1" variant="outline" onClick={closeSharedModal}>
                                  Deny
                                </Button>
                              </Flex>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </GridItem>
                    ))}
                  </Grid>
                </>
              )}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
