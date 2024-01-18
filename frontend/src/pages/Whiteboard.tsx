import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "../components/Whiteboard/Canvas"; // Adjust the path as needed
import NavBar from "../components/Whiteboard/NavBar";

import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Whiteboard: React.FC = () => {
  const location = useLocation();
  const initialTitle = location.state?.title || 'Untitled';
  const uniqueID = location.state?.uniqueID || uuidv4();
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div>
      <NavBar
        onToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
      />
      <Canvas
        documentTitle={documentTitle}
        documentId={uniqueID}
      />
    </div>
  );
};

export default Whiteboard;
