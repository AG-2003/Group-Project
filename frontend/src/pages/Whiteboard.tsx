import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "../components/Whiteboard/Canvas"; // Adjust the path as needed
import NavBar from "../components/Whiteboard/NavBar";

import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { documentId } from "firebase/firestore";



const Whiteboard: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uniqueID = decodeURIComponent(params.get('id') || '');
  const initialTitle = location.state?.title||'Untitled';
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
        suiteId={uniqueID}
        suiteTitle={documentTitle}
        setSuiteTitle={setDocumentTitle}
      />
    </div>
  );
};

export default Whiteboard;
