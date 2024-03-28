import React, { useEffect, useState } from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import JoinedTeams from "../Teams/JoinedTeams";
import CreateJoin from "../Teams/CreateJoin";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Dashboard/sidebar";

const Teams = () => {
  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [wasManuallyClosed, setWasManuallyClosed] = useState(false);

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

  useEffect(() => {
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

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ position: "fixed", width: "100%" }}>
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
                  backgroundColor: "#f6f6f6",
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
                  backgroundColor: "#f6f6f6",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  flexShrink: "0",
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
                  flexShrink: "0",
                }}
              >
                <SideBar />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <Box
          flexGrow={1}
          padding="10px"
          marginLeft={5}
          overflowY="auto"
          position="relative"
          zIndex="1"
        >
          <Flex
            className="containerTeams"
            direction="column"
            marginLeft={5}
            marginTop={3}
          >
            <>
              <CreateJoin />
              <JoinedTeams />
            </>
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default Teams;
