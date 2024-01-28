import React, { useState } from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import JoinedTeams from "../Teams/JoinedTeams";
import TeamDetails from "../Teams/TeamDetails"; // Import the TeamDetails component
import TeamsChat from "../Teams/TeamsChat";
import CreateJoin from "../Teams/CreateJoin";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Dashboard/sidebar";

const Teams = () => {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [inChat, setInChat] = useState(false);

  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTeamClick = (teamId: string) => {
    // Update the current team ID when a team is clicked
    setCurrentTeamId(teamId);
  };

  const handleChatClick = () => {
    setInChat(!inChat);
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
          <Flex direction="column" height="100vh" p={8}>
            {currentTeamId ? (
              <>
                {inChat ? (
                  <TeamsChat teamId={currentTeamId} />
                ) : (
                  <TeamDetails
                    teamId={currentTeamId}
                    onChatsClick={handleChatClick}
                  />
                )}
              </>
            ) : (
              <>
                <CreateJoin />
                <JoinedTeams onTeamClick={handleTeamClick} />
              </>
            )}
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Teams;
