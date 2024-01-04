import React, { useState } from "react";
import { Divider, Box } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Dashboard/Navbar";
import Projects from "../components/Dashboard/Projects";
import Profile from "../components/Dashboard/Profile";
import SideBar from "../components/Dashboard/Sidebar";
// import Trash from "./Trash";
import Trash from "../components/Trash/TrashAlt";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [currentComponent, setCurrentComponent] = useState("Profile");

  const handleButtonClick = (component: string) => {
    setCurrentComponent(component);
  };

  // Variants for Framer Motion animation
  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div style={{ padding: "10px", background: "#484c6c" }}>
        <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial="closed"
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
              <SideBar onButtonClick={handleButtonClick} />
            </motion.div>
          )}
        </AnimatePresence>
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          {currentComponent == "Profile" && <Profile />}
          {currentComponent == "Projects" && <Projects />}
          {/* {currentComponent == "Templates" && <Templates />} */}
          {/* {currentComponent == "Teams" && <Teams />} */}
          {/* {currentComponent == "Calls" && <Calls />} */}
          {/* {currentComponent == "Calendar" && <Calendar />} */}
          {/* {currentComponent == "Social" && <Social />} */}
          {currentComponent == "Trash" && <Trash />}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
