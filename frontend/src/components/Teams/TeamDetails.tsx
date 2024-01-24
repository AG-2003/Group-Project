// import React, { useEffect, useState } from "react";
// import { Avatar, Flex, Box, Text, Stack, Badge } from "@chakra-ui/react";
// import { db } from "../../firebase-config";
// import { doc, getDoc, DocumentData } from "firebase/firestore";

// interface TeamDetailsProps {
//   teamId: string;
// }

// const TeamDetails: React.FC<TeamDetailsProps> = ({
//   teamId,
// }: TeamDetailsProps) => {
//   const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);

//   useEffect(() => {
//     const fetchTeamDetails = async () => {
//       try {
//         const teamDocRef = doc(db, "teams", teamId);
//         const teamDocSnapshot = await getDoc(teamDocRef);

//         if (teamDocSnapshot.exists()) {
//           setTeamDetails(teamDocSnapshot.data());
//         }
//       } catch (error) {
//         console.error("Error fetching team details:", error);
//       }
//     };

//     fetchTeamDetails();
//   }, [teamId]);

//   return (
//     <div className="team-details-container">
//       {teamDetails ? (
//         <div>
//           <div className="profile-container">
//             <Flex className="profile-header">
//               <Flex className="profile-info">
//                 <Avatar
//                   className="profile-avatar"
//                   src={teamDetails.image || "fallback_image_url"}
//                   name={teamDetails.name}
//                   borderRadius="10%" // Adjust this value as needed
//                 />
//                 <Box className="profile-text">
//                   <Text className="profile-name">{teamDetails.name}</Text>
//                   <Text className="profile-description">
//                     {teamDetails.description || "Your Description"}
//                   </Text>
//                 </Box>
//               </Flex>

//               <Stack className="profile-stats">
//                 <Badge className="badge">7 Projects</Badge>
//                 <Badge className="badge">11 Communities</Badge>
//                 <Badge className="badge">4 Awards</Badge>
//               </Stack>
//             </Flex>
//             <Flex className="profile-body">
//               {/* The commented out sections can be replaced with your components */}
//               {/* <DashboardSection title="Your Teams" items={teams} />
//         <DashboardSection title="Your Communities" items={communities} /> */}
//             </Flex>
//           </div>
//         </div>
//       ) : (
//         <p>Loading team details...</p>
//       )}
//     </div>
//   );
// };

// export default TeamDetails;

// TeamDetails.tsx

import React, { useEffect, useState } from "react";
import { Avatar, Flex, Box, Text, Stack, Badge, Divider } from "@chakra-ui/react";
import { db } from "../../firebase-config";
import {
  doc,
  getDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import "./TeamDetails.scss"; // Import the SCSS file
import { IoChatbubblesSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import InvModal from "./InvModal";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Dashboard/sidebar";

const TeamDetails: React.FC = () => {
  const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);
  let { team_id } = useParams();
  const navigate = useNavigate();

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
  }, [team_id]);

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
              <Text className="projects-title">Projects</Text>
              <button className="invite-button" onClick={handleInvClick}>
                Invite Members
              </button>
            </Flex>
            <p className="no-documents-message">There are no documents yet.</p>
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
