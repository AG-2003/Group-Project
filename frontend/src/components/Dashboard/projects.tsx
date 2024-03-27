import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Projects.scss";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  GridItem,
  Text
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { UseToastNotification } from "../../utils/UseToastNotification";
import SideBar from "./sidebar";
import { SuiteData } from "../../interfaces/SuiteData";
import { FiClipboard, FiFileText, FiGrid } from "react-icons/fi";
import ProjectModal from "./sub-components/Modal";
import DocBg from "../../assets/DocBg.png";
import BoardBg from "../../assets/BoardBg.png";
import SheetBg from "../../assets/SheetBg.png";
import NoProj from "../../assets/ProjectsEmpty.png";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<SuiteData[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SuiteData[]>([]);
  const [user] = useAuthState(auth);
  const showToast = UseToastNotification();
  const navigate = useNavigate();

  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

  // basic UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State to track whether the sidebar was manually closed by the user
  const [wasManuallyClosed, setWasManuallyClosed] = useState(false);

  // State to control the visibility and type of the modal
  const [modalType, setModalType] = useState("");

  // Function to open the modal
  const openModal = (type: string) => setModalType(type);

  // Function to close the modal
  const closeModal = () => setModalType("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; type: string; event: React.MouseEvent } | null>(null);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [sharedProjectToDelete, setSharedProjectToDelete] = useState<{ id: string; type: string} | null>(null);

  // Function to handle the confirmation (submit) of the modal
  const handleConfirm = () => closeModal(); // Close the modal after submission

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  const sidebarVariantsMobile = {
    open: { width: "100%" },
    closed: { width: "0px" },
  };

  // // Function to toggle the sidebar
  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // This function is called when the toggle button is clicked
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // If toggling the sidebar, we record the action as a manual close/open
    setWasManuallyClosed(true);
  };

  useEffect(() => {
    fetchProjects();

    fetchProjects();

    // Function to automatically check the sidebar status on window resize
    const checkSidebar = () => {
      const mobileBreakpoint = 768;
      // Close the sidebar if window size is less than the breakpoint and it was not manually closed
      if (window.innerWidth < mobileBreakpoint && !wasManuallyClosed) {
        setIsSidebarOpen(false);
      } else if (window.innerWidth >= mobileBreakpoint && !wasManuallyClosed) {
        // Reopen the sidebar when window size is above the breakpoint and it was not manually closed
        setIsSidebarOpen(true);
      }
    };

    // Set up the event listener
    window.addEventListener("resize", checkSidebar);

    // Check the initial size of the window
    checkSidebar();

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", checkSidebar);
  }, [wasManuallyClosed]);

  const fetchProjects = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      const sharedDocsRef = collection(db, "sharedDocs");
      const sharedBoardsRef = collection(db, "sharedBoards");

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userDocuments: SuiteData[] = userData.documents || [];
        const userSheets: SuiteData[] = userData.sheets || [];
        const userWhiteboards: SuiteData[] = userData.boards || [];
        const userPowerpoints: SuiteData[] = userData.powerpoints || [];

        // Fetch shared documents and shared boards
        const sharedDocsSnapshot = await getDocs(sharedDocsRef);
        const sharedBoardsSnapshot = await getDocs(sharedBoardsRef);

        // Filter shared documents and shared boards based on the user's email
        const filteredSharedDocs = sharedDocsSnapshot.docs
          .filter(
            (doc) =>
              doc.data().user?.includes(user.email) &&
              doc.data().isTrash === false &&
              !doc.data().hasOwnProperty("team_id")
          )
          .map((doc) => doc.data() as SuiteData);
        const filteredSharedBoards = sharedBoardsSnapshot.docs
          .filter(
            (doc) =>
              doc.data().user?.includes(user.email) &&
              doc.data().isTrash === false
          )
          .map((doc) => doc.data() as SuiteData);

        // Use the existing lastEdited field from Firestore data, don't generate a new one
        let combinedProjects: SuiteData[] = [
          ...userDocuments,
          ...userSheets,
          ...userWhiteboards,
          ...userPowerpoints,
        ];

        combinedProjects = combinedProjects.filter(
          (project: SuiteData) => !project.isTrash && !project.isShared
        );

        setProjects(combinedProjects);
        setSharedProjects([...filteredSharedDocs, ...filteredSharedBoards]);
        setIsLoadingProjects(false);
      }
      setIsLoadingProjects(false);
    }
  };

  const handleCardClick = (
    projectId: string,
    projectTitle: string,
    type: string
  ) => {
    // Adjust the navigation path based on the project type
    let path: string = "";
    switch (type) {
      case "document":
        path = `/doc/?id=${encodeURIComponent(projectId)}`;
        break;
      case "sheet":
        path = `/sheet/?id=${encodeURIComponent(projectId)}`;
        break;
      case "board":
        path = `/board/?id=${encodeURIComponent(projectId)}`;
        break;
      // Add case for 'slides' as necessary
    }
    navigate(path, { state: { projectTitle } });
  };

  const handleSharedCardClick = (
    projectId: string,
    projectTitle: string,
    type: string
  ) => {
    // Adjust the navigation path based on the project type
    let path: string = "";
    switch (type) {
      case "document":
        path = `/doc/share/?id=${encodeURIComponent(projectId)}`;
        break;
      case "board":
        path = `/board/share/?id=${encodeURIComponent(projectId)}`;
        break;
      // Add case for 'slides' as necessary
    }
    navigate(path, { state: { projectTitle } });
  };

  const getImageForType = (type: string): string => {
    switch (type) {
      case "document":
        return DocBg;
      case "board":
        return BoardBg;
      case "sheet":
        return SheetBg;
      default:
        // Assuming you have a default image imported
        return ""; // Replace with your imported default image variable
    }
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
    type: string,
    event: React.MouseEvent
  ): Promise<void> => {
    event.stopPropagation();
    const userEmail = user?.email;
    if (userEmail) {
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
            suitesArray[suiteIndex].isTrash = true; // Set isTrash to true for the suite

            // Update the user's document with the new suites array
            await setDoc(
              userDocRef,
              { [suiteTypePlural]: suitesArray },
              { merge: true }
            );
            fetchProjects();
          }
        }
      } catch (error) {
        console.error("Error moving suite to trash:", error);
      }
    }
  };

  const handleSharedTrashIconClick = async (id: string, type: string) => {
    if (user?.email) {
      try {
        let sharedDocRef: DocumentReference<DocumentData, DocumentData>;
        if (type === "document") {
          sharedDocRef = doc(db, "sharedDocs", id);
        } else {
          sharedDocRef = doc(db, "sharedBoards", id);
        }

        if (sharedDocRef) {
          const docSnapshot = await getDoc(sharedDocRef);

          if (docSnapshot.exists()) {
            // Fetch the document data
            const docData = docSnapshot.data();

            // Check if the user's email matches the 'owner' property of the document
            if (docData && docData.owner === user.email) {
              // If the condition is met, update the isTrash property to true
              await setDoc(sharedDocRef, { isTrash: true }, { merge: true });
            } else {
              showToast("error", "You are NOT the owner of this project");
            }
          }
        }
      } catch (error) {
        console.error("Error moving suite to trash:", error);
      }
    }

    fetchProjects();
  };

  return (
    <div style={{ position: "fixed", width: "100%"}}>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)" position="relative">
        {!isDesktop && (
          <AnimatePresence>
            {isSidebarOpen ? (
              <motion.div
                initial="open"
                animate="open"
                exit="closed"
                variants={sidebarVariantsMobile}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  paddingTop: "10px",
                  height: "inherit",
                  backgroundColor: "#f4f1fa",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "absolute",
                  zIndex: "2",
                }}
              >
                <SideBar />
              </motion.div>
            ) : (
              <motion.div
                initial="closed"
                animate="clsoed"
                exit="open"
                variants={sidebarVariantsMobile}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  paddingTop: "10px",
                  height: "inherit",
                  backgroundColor: "#f6f6f6",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "absolute",
                  zIndex: "2",
                }}
              >
                <SideBar />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {isDesktop && (
          <AnimatePresence>
            {isSidebarOpen ? (
              <motion.div
                initial="open"
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
            ) : (
              <motion.div
                initial="closed"
                animate="clsoed"
                exit="open"
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  paddingTop: "10px",
                  height: "inherit",
                  backgroundColor: "#f6f6f6",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <SideBar />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {/* Code is contained in this box */}
        <Box
         
          flexGrow={1}
         
          padding="10px"
         
          marginLeft={5}
          overflowY="auto"
          position="relative"
          zIndex="1"
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
          {isLoadingProjects ? (
            <Flex
              height="100vh" // Adjust this to the desired height or use "100%" for full container height
              alignItems="center"
              justifyContent="center"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            <>
              <div className="projects-container">
                {projects.length !== 0 && (
                  <h2 className="projects-heading">Recent Designs</h2>
                )}
                {projects.length === 0 && sharedProjects.length === 0 && (
                    <>
                      <div className="no-projects">
                        <h3 className="no-projects-title">
                          Don't have a design?
                        </h3>
                        <p className="no-projects-text">
                          Create your first design now!
                        </p>
                        <ProjectModal
                          isOpen={modalType !== ""}
                          onClose={closeModal}
                          // onConfirm={handleConfirm}
                          modalType={modalType}
                        />
                        <Menu>
                          <MenuButton
                            as={Button}
                            colorScheme="purple"
                            mr={4}
                            size="sm"
                          >
                            Create a design
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<FiFileText />}
                              onClick={() => openModal("Doc")}
                            >
                              Doc
                            </MenuItem>
                            <MenuItem
                              icon={<FiGrid />}
                              onClick={() => openModal("Spreadsheet")}
                            >
                              Spreadsheet
                            </MenuItem>
                            <MenuItem
                              icon={<FiClipboard />}
                              onClick={() => openModal("Whiteboard")}
                            >
                              Whiteboard
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Box textAlign="center" mt="20px" display="flex" justifyContent="center">
                        <img
                          className="ProjImage"
                          src={NoProj}
                          alt="No Projects"
                          
                        />
                      </Box>
                    </>
                  )}
                  <Grid templateColumns="repeat(auto-fit, max(300px))" gap={6}>
                    {projects.map((project) => (
                      <GridItem key={project.id} w="100%"  _hover={{transform: "translateY(-1px)", shadow: "lg"}}>
                        <Box
                          h="150px"
                          bgImage={`url(${getImageForType(project.type )})`}
                          onClick={ () => handleCardClick(project.id, project.title, project.type)}
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
                          justifyContent="flex-end"
                          alignItems="center"
                          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        >
                          <IconButton
                            icon={<Icon as={FaTrash} color="#484c6c" />}
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                              marginRight: "8px", // Add margin to separate icons
                            }}
                            transition="transform 0.3s ease-in-out"
                            _hover={{ transform: "scale(1.1)", border: "black" }}
                            aria-label="Delete Project"
                            onClick={(event) => {
                              event.stopPropagation();
                              setProjectToDelete({ id: project.id, type: project.type, event });
                              setIsModalOpen(true);
                          }}
                          />
                        </Box>
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Confirm Deletion</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                  Are you sure you want to delete this project? This action cannot be undone.
                                </ModalBody>
                                <ModalFooter>
                                  <Button colorScheme="red" mr={3} onClick={() => {
                                    if (projectToDelete) {
                                      handleTrashIconClick(projectToDelete.id, projectToDelete.type, projectToDelete.event);
                                    }
                                    setIsModalOpen(false);
                                  }}>
                                    Confirm
                                  </Button>
                                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                  </Button>
                                </ModalFooter>
                            </ModalContent>
                          </Modal>
                      </GridItem>
                    ))}
                  </Grid>
                  {sharedProjects.length !== 0 && (
                  <h2 className="projects-heading">Shared</h2>
                  )}
                  <Grid templateColumns="repeat(auto-fit, max(300px))" gap={6}>
                    {sharedProjects.map((project) => (

                      <GridItem key={project.id} w="100%"  _hover={{transform: "translateY(-1px)", shadow: "lg"}}>
                        <Box
                          h="150px"
                          bgImage={`url(${getImageForType(project.type )})`}
                          onClick={ () => handleSharedCardClick(project.id, project.title, project.type)}
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
                          justifyContent="flex-end"
                          alignItems="center"
                          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        >
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
                            onClick={(event) => {
                              event.stopPropagation();
                              setSharedProjectToDelete({ id: project.id, type: project.type });
                              setIsSharedModalOpen(true);
                          }}
                          />
                        </Box>
                        <Modal isOpen={isSharedModalOpen} onClose={() => setIsSharedModalOpen(false)}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Confirm Deletion</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                  Are you sure you want to delete this shared project? This action cannot be undone.
                                </ModalBody>
                                <ModalFooter>
                                  <Button colorScheme="red" mr={3} onClick={() => {
                                    if (sharedProjectToDelete) {
                                      handleSharedTrashIconClick(sharedProjectToDelete.id, sharedProjectToDelete.type,);
                                    }
                                    setIsSharedModalOpen(false);
                                  }}>
                                    Confirm
                                  </Button>
                                  <Button variant="ghost" onClick={() => setIsSharedModalOpen(false)}>
                                    Cancel
                                  </Button>
                                </ModalFooter>
                            </ModalContent>
                          </Modal>
                      </GridItem>
                    ))}
                  </Grid>
                </div>

              {/* {sharedProjects.length !== 0 &&
                <div className="projects-container">
                  <h2 className="projects-heading">Shared</h2>
                  <div className="projects-list">
                    {sharedProjects.map((project: SuiteData) => (
                      <div
                        key={project.id}
                        className="project-card"
                        onClick={() =>
                          handleSharedCardClick(
                            project.id,
                            project.title,
                            project.type
                          )
                        }
                      >
                        <div
                          className="card-top"
                          style={{
                            backgroundImage: `url(${getImageForType(
                              project.type
                            )})`,
                          }}
                        >
                          <h3 className="project-title">{project.title}</h3>
                        </div>
                        <div className="card-bottom">
                          <p className="last-edited">
                            Last edited: {formatDate(project.lastEdited)}
                          </p>
                          <IconButton
                            icon={<Icon as={FaTrash} color="#484c6c" />}
                            size="sm"
                            aria-label="Delete Project"
                            className="delete-icon"
                            onClick={(event) => {
                                event.stopPropagation();
                                setSharedProjectToDelete({ id: project.id, type: project.type });
                                setIsSharedModalOpen(true);
                            }}
                            />
                            <Modal isOpen={isSharedModalOpen} onClose={() => setIsSharedModalOpen(false)}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Confirm Deletion</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                  Are you sure you want to delete this project? This action cannot be undone.
                                </ModalBody>
                                <ModalFooter>
                                  <Button colorScheme="red" mr={3} onClick={() => {
                                    if (sharedProjectToDelete) {
                                      handleSharedTrashIconClick(sharedProjectToDelete.id, sharedProjectToDelete.type,);
                                    }
                                    setIsSharedModalOpen(false);
                                  }}>
                                    Confirm
                                  </Button>
                                  <Button variant="ghost" onClick={() => setIsSharedModalOpen(false)}>
                                    Cancel
                                  </Button>
                                </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>} */}
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Projects;
