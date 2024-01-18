import React, { useState } from "react";
import Sheet from "../components/Spreadsheet/Sheet"; // Adjust the path as needed
import NavBar from "../components/Spreadsheet/NavBar";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Whiteboard: React.FC = () => {
  const location = useLocation();
  const initialTitle = location.state?.title || 'Untitled';
  const uniqueID = location.state?.uniqueID || uuidv4();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [documentTitle, setDocumentTitle] = useState(initialTitle);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <NavBar
        onToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
      />
      <Sheet
        documentTitle={documentTitle}
        documentId={uniqueID}
      />
    </div>
  );
};

export default Whiteboard;
