import React, { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Box,
  Text,
  Stack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { db } from "../../firebase-config";
import {
  doc,
  getDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import "./CDetails.scss"; // Import the SCSS file
import { IoChatbubblesSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
// import InvModal from "./InvModal";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Dashboard/sidebar";

const CommunityDetails: React.FC = () => {
  const [communityDetails, setCommunityDetails] = useState<DocumentData | null>(
    null
  );
  let { community_id } = useParams();
  const navigate = useNavigate();

  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (community_id) {
    community_id = decodeURIComponent(community_id);
  }

  const handleChatClick = (communityId: string) => {
    navigate(`/In_communities/chat/${encodeURIComponent(communityId)}`);
  };

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        if (community_id) {
          // Ensure communityId is defined before creating the DocumentReference
          const communityDocRef: DocumentReference<DocumentData> = doc(
            db,
            "communities",
            community_id
          );
          const communityDocSnapshot = await getDoc(communityDocRef);

          if (communityDocSnapshot.exists()) {
            setCommunityDetails(communityDocSnapshot.data());
          }
        }
      } catch (error) {
        console.error("Error fetching community details:", error);
      }
    };

    fetchCommunityDetails();
  }, [community_id]);

  // inv stuff
  const [isInvModalOpen, setInvModalOpen] = useState(false);

  const handleInvClick = () => {
    setInvModalOpen(true);
  };

  const handleInvModalClose = () => {
    setInvModalOpen(false);
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
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          <div className="community-details-container">
            {communityDetails ? (
              <div className="profile-container">
                <Flex className="profile-header">
                  <Flex className="profile-info">
                    <Avatar
                      className="profile-avatar"
                      src={communityDetails.image || "fallback_image_url"}
                      name={communityDetails.name}
                      borderRadius="10%" // Adjust this value as needed
                    />
                    <Box className="profile-text">
                      <Text className="profile-name">
                        {communityDetails.name}
                      </Text>
                      <Text className="profile-description">
                        {communityDetails.description || "Your Description"}
                      </Text>
                    </Box>
                  </Flex>

                  <Stack className="profile-stats">
                    <Badge className="badge">0 Projects</Badge>
                    <Badge className="badge">
                      {communityDetails.members.length + 1} Members
                    </Badge>
                    <Badge className="badge">0 Awards</Badge>
                  </Stack>
                </Flex>
                <Flex className="profile-body">
                  <Flex className="top-titles">
                    <Text className="projects-title">Projects</Text>
                    <button className="invite-button" onClick={handleInvClick}>
                      Invite Members
                    </button>
                  </Flex>
                  <p className="no-documents-message">
                    There are no documents yet.
                  </p>
                </Flex>
                {/* chat onclick goes here */}

                <div
                  className="circular-button"
                  onClick={() => {
                    if (community_id) {
                      handleChatClick(community_id);
                    }
                  }}
                >
                  <IoChatbubblesSharp />
                </div>

                {/* <InvModal
                  communityId={community_id}
                  isOpen={isInvModalOpen}
                  onClose={handleInvModalClose}
                /> */}
              </div>
            ) : (
              <p>Loading community details...</p>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CommunityDetails;
