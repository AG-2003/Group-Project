import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "../components/Whiteboard/Canvas"; // Adjust the path as needed
import NavBar from "../components/Whiteboard/NavBar";

import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { documentId } from "firebase/firestore";
import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../components/Whiteboard/sideBar";

const Whiteboard: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uniqueID = decodeURIComponent(params.get("id") || "");
  const initialTitle = location.state?.title || "Untitled";
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);

  const sidebarVariants = {
    open: { width: "100%" },
    closed: { width: "0px" },
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div style={{ position: "fixed", width: "100%" }}>
      <NavBar
        onToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
      />
      <Box display="flex" height="calc(100vh)" position="relative">
        {!isDesktop && (
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
                variants={sidebarVariants}
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
                <SideBar
                  onNavigate={function (arg: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <Box style={{ width: "100%", position: "relative", zIndex: "1" }}>
          <Canvas
            suiteId={uniqueID}
            suiteTitle={documentTitle}
            setSuiteTitle={setDocumentTitle}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Whiteboard;
