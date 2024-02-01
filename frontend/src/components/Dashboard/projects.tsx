import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "./sidebar";
import { SuiteData } from "../../interfaces/SuiteData";
import { FiClipboard, FiFileText, FiGrid } from "react-icons/fi";
import Modal from "./sub-components/Modal";
import DocBg from "../../assets/DocBg.png";
import BoardBg from "../../assets/BoardBg.png";
import SheetBg from "../../assets/SheetBg.png";
import NoProj from "../../assets/ProjectsEmpty.png";
const Projects: React.FC = () => {
  const [projects, setProjects] = useState<SuiteData[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SuiteData[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

  // basic UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State to control the visibility and type of the modal
  const [modalType, setModalType] = useState("");

  // Function to open the modal
  const openModal = (type: string) => setModalType(type);

  // Function to close the modal
  const closeModal = () => setModalType("");

  // Function to handle the confirmation (submit) of the modal
  const handleConfirm = () => closeModal(); // Close the modal after submission

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchProjects();

    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

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

        const sharedProjects = combinedProjects.filter(
          (project: SuiteData) => !project.isTrash && project.isShared
        );

        combinedProjects = combinedProjects.filter(
          (project: SuiteData) => !project.isTrash && !project.isShared
        );

        setProjects(combinedProjects);
        setSharedProjects(sharedProjects);
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

  return (
    <>
      <div style={{ padding: "10px", background: "#484c6c" }}>
        <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)">
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
                backgroundColor: "#f6f6f6",
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
        {/* Code is contained in this box */}
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          {isLoadingProjects ? (<Flex
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
          </Flex>) : <div className="projects-container">
            <h2 className="projects-heading">Recent Designs</h2>
            <div className="projects-list">
              {projects.map((project: SuiteData) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() =>
                    handleCardClick(project.id, project.title, project.type)
                  }
                >
                  <div
                    className="card-top"
                    style={{
                      backgroundImage: `url(${getImageForType(project.type)})`,
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
                        handleTrashIconClick(project.id, project.type, event);
                      }}
                    />
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <>
                  <div className="no-projects">
                    <h3 className="no-projects-title">Don't have a design?</h3>
                    <p className="no-projects-text">
                      Create your first design now!
                    </p>
                    <Modal
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
                  <Box textAlign="center" mt="20px">
                    <img className="ProjImage" src={NoProj} alt="No Projects" />
                  </Box>
                </>
              )}
            </div>
          </div>}

        </Box>
      </Box>
    </>
  );
};

export default Projects;
