import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useHistory
import "./Projects.scss";
import Navbar from "./Navbar";
import { Box, Divider } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "./sidebar";

interface Document {
  id: string;
  title: string;
  content: string;

  // Add other fields as necessary, like lastEdited, if available
}

const Projects: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate(); // Use the useHistory hook for navigation

  // basic UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user?.email) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userDocuments = userData.documents || [];
          setDocuments(userDocuments);
        }
      }
    };

    fetchDocuments();
  }, [user]);

  // Function to handle click on a project card
  const handleCardClick = (documentId: string, documentTitle: string) => {
    // Navigate to the editor page with the documentId
    navigate(
      `/doc/?id=${encodeURIComponent(documentId)}&title=${encodeURIComponent(
        documentTitle
      )}`
    );
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
        {/* Code is contained in this box */}
        <Box flexGrow={1} padding="10px" marginLeft={5}>
          <div className="projects-container">
            <h2 className="projects-heading">Recent Designs</h2>
            <div className="projects-list">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="project-card"
                  onClick={() => handleCardClick(doc.id, doc.title)}
                >
                  <h3 className="project-title">{doc.title}</h3>
                  <p className="project-content">
                    {doc.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="no-projects">
                  <h3 className="no-projects-title">Don't have a design?</h3>
                  <p className="no-projects-text">
                    Create your first design now!
                  </p>
                  <button className="create-button">Create a design</button>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Projects;
