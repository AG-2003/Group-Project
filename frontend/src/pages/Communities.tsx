import { Box, Divider, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../components/Social/sideBar";
import Navbar from "../components/Dashboard/Navbar";
import CreateCommunity from "../components/communities/CreateCommunity";
import JoinedC from "../components/communities/JoinedC";

const Communities = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
                  backgroundColor: "#f4f1fa",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "absolute",
                  zIndex: "2",
                }}
              >
                <SideBar
                  onNavigate={function (arg: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
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
                  backgroundColor: "#f4f1fa",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "absolute",
                  zIndex: "2",
                }}
              >
                <SideBar
                  onNavigate={function (arg: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
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
                flexShrink: "0",
              }}
            >
              <SideBar
                onNavigate={function (arg: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
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
                backgroundColor: "#f4f1fa",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                flexShrink: "0",
              }}
            >
              <SideBar
                onNavigate={function (arg: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        )}
        <Box flexGrow={1} padding="10px" marginLeft={5} overflowY="auto" position="relative" zIndex='1'>
          <Flex
            className="containerTeams"
            direction="column"
            marginLeft={5}
            marginTop={3}
          >
            <>
              <CreateCommunity />
              <JoinedC />
            </>
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default Communities;
