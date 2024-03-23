import React, { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Box,
  Text,
  Stack,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  Button,
  MenuList,
  Icon,
  IconButton
} from "@chakra-ui/react";
import { auth, db } from "../../firebase-config";
import {
  doc,
  getDoc,
  DocumentData,
  DocumentReference,
  collection,
  getDocs,
} from "firebase/firestore";
import "./TeamDetails.scss"; // Import the SCSS file
import { IoChatbubblesSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import InvModal from "./InvModal";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Dashboard/sidebar";
import { SuiteData } from "../../interfaces/SuiteData";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiFileText, FiClipboard } from "react-icons/fi";
import Modal from "./sub-components/Modal";
import DocBg from "../../assets/DocBg.png";
import BoardBg from "../../assets/BoardBg.png";
import SheetBg from "../../assets/SheetBg.png";
import { FaTrash } from "react-icons/fa";

const TeamDetails: React.FC = () => {
  const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);
  const [user] = useAuthState(auth);
  const [sharedProjects, setSharedProjects] = useState<SuiteData[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  let { team_id } = useParams();
  const navigate = useNavigate();

  // State to control the visibility and type of the modal
  const [modalType, setModalType] = useState("");

  // Function to open the modal
  const openModal = (type: string) => setModalType(type);

  // Function to close the modal
  const closeModal = () => setModalType("");

  // Function to handle the confirmation (submit) of the modal
  const handleConfirm = () => closeModal(); // Close the modal after submission

  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (team_id) {
    team_id = decodeURIComponent(team_id);
  }

  const handleChatClick = (teamId: string) => {
    navigate(`/In_teams/chat/${encodeURIComponent(teamId)}`);
  };

  const fetchProjects = async () => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      const sharedDocsRef = collection(db, "sharedDocs");
      const sharedBoardsRef = collection(db, "sharedBoards");

      if (userDocSnapshot.exists()) {
        // Fetch shared documents and shared boards
        const sharedDocsSnapshot = await getDocs(sharedDocsRef);
        const sharedBoardsSnapshot = await getDocs(sharedBoardsRef);

        // Filter shared documents and shared boards based on the user's email
        const filteredSharedDocs = sharedDocsSnapshot.docs.filter(doc =>
          doc.data().team_id === team_id
        ).map(doc => doc.data() as SuiteData);
        // const filteredSharedBoards = sharedBoardsSnapshot.docs.filter(doc =>
        //   doc.data().user?.includes(user.email) && doc.data().isTrash === false
        // ).map(doc => doc.data() as SuiteData);

        setSharedProjects([...filteredSharedDocs/*, ...filteredSharedBoards*/]);
        setIsLoadingProjects(false)
      }
    }
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        if (team_id) {
          // Ensure teamId is defined before creating the DocumentReference
          const teamDocRef: DocumentReference<DocumentData> = doc(
            db,
            "teams",
            team_id
          );
          const teamDocSnapshot = await getDoc(teamDocRef);

          if (teamDocSnapshot.exists()) {
            setTeamDetails(teamDocSnapshot.data());
          }
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
    fetchProjects()
  }, [team_id]);

  // inv stuff
  const [isInvModalOpen, setInvModalOpen] = useState(false);

  const handleInvClick = () => {
    setInvModalOpen(true);
  };

  const handleInvModalClose = () => {
    setInvModalOpen(false);
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

  const handleSharedCardClick = (
    projectId: string,
    projectTitle: string,
    type: string
  ) => {
    // Adjust the navigation path based on the project type
    let path: string = "";
    switch (type) {
      case "document":
        path = `/doc/share-teams/?id=${encodeURIComponent(projectId)}`;
        break;
      case "board":
        path = `/board/share/?id=${encodeURIComponent(projectId)}`;
        break;
      // Add case for 'slides' as necessary
    }
    navigate(path, { state: { projectTitle } });
  };

  return (
    <>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
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
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          <div className="team-details-container">
            {teamDetails ? (
              <div className="profile-container">
                <Flex className="profile-header">
                  <Flex className="profile-info">
                    <Avatar
                      className="profile-avatar"
                      src={teamDetails.image || "fallback_image_url"}
                      name={teamDetails.name}
                      borderRadius="10%" // Adjust this value as needed
                    />
                    <Box className="profile-text">
                      <Text className="profile-name">{teamDetails.name}</Text>
                      <Text className="profile-description">
                        {teamDetails.description || "Your Description"}
                      </Text>
                    </Box>
                  </Flex>

                  <Stack className="profile-stats">
                    <Badge className="badge">0 Projects</Badge>
                    <Badge className="badge">
                      {teamDetails.members.length + 1} Members
                    </Badge>
                    <Badge className="badge">0 Awards</Badge>
                  </Stack>
                </Flex>
                <Flex className="profile-body">
                  <Flex className="top-titles">
                  <Modal
                    isOpen={modalType !== ""}
                    onClose={closeModal}
                    // onConfirm={handleConfirm}
                    modalType={modalType}
                    team_id={`${team_id}`}
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
                        {/* <MenuItem
                          icon={<FiClipboard />}
                          onClick={() => openModal("Whiteboard")}
                        >
                            Whiteboard
                        </MenuItem> */}
                      </MenuList>
                    </Menu>
                    <button className="invite-button" onClick={handleInvClick}>
                      Invite Members
                    </button>
                  </Flex>
                  {isLoadingProjects || sharedProjects.length===0 ? (<p className="no-documents-message">
                    There are no documents yet.
                  </p>) : (
                    sharedProjects.length !== 0 &&
                      <div className="projects-container">
                        <div className="projects-list">
                          {sharedProjects.map((project: SuiteData) => (
                            <div
                              key={project.id}
                              className="project-card"
                              onClick={() =>
                                handleSharedCardClick(project.id, project.title, project.type)
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
                                  onClick={(event: { stopPropagation: () => void; }) => {
                                    event.stopPropagation();
                                    // handleSharedTrashIconClick(project.id, project.type);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                  )}
                </Flex>
                {/* chat onclick goes here */}

                <div
                  className="circular-button"
                  onClick={() => {
                    if (team_id) {
                      handleChatClick(team_id);
                    }
                  }}
                >
                  <IoChatbubblesSharp />
                </div>

                <InvModal
                  teamId={team_id}
                  isOpen={isInvModalOpen}
                  onClose={handleInvModalClose}
                />
              </div>
            ) : (
              <p>Loading team details...</p>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default TeamDetails;
