import { Box, Divider } from "@chakra-ui/react";
import { CalendarComponent } from "../components/Calendar/CalendarComponent";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import Sidebar from "../components/Dashboard/sidebar";

export const Calendar = () => {

  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)" width="100%">
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
              }}
            >
              <Sidebar />
            </motion.div>
          ) : (
            <motion.div
              initial="closed"
              animate="closed"
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
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        <CalendarComponent />


      </Box>
    </>
  )


};
