import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  SimpleGrid,
  Badge,
  Stack,
  Avatar,
  Button,
  Divider,
  Input,
  Image,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import NavBar from "../components/Doc_/NavBar";
import SideBar from "../components/Doc_/sideBar";
// import ToolBar from "../components/Doc_/ToolBar";
import Document from "../components/Doc_/Document";
import Footer from "../components/Doc_/Footer";
import "./Doc.scss"; // Make sure you import Doc.scss here
import { useLocation } from "react-router-dom";

const Doc: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uniqueID = decodeURIComponent(params.get("id") || "");
  const initialTitle = location.state?.title || "Untitled";
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handleZoomChange = (newZoomLevel: number) => {
    // Logic to update document size
  };

  return (
    <div className="doc-container">
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
          <Document
            suiteId={uniqueID}
            suiteTitle={documentTitle}
            setSuiteTitle={setDocumentTitle}
          />
          <Footer onZoomChange={handleZoomChange} />
        </Box>
      </Box>
    </div>
  );
};

export default Doc;
