import React, { useState } from "react";
import NavBar from "../components/Doc_/NavBar";
// import ToolBar from "../components/Doc_/ToolBar";
import Document from "../components/Doc_/Document";
import Footer from "../components/Doc_/Footer";
import "./Doc.scss"; // Make sure you import Doc.scss here
import { useLocation } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';

const Doc: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uniqueID = decodeURIComponent(params.get('id') || '');
  const initialTitle = location.state?.title||'Untitled';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [documentTitle, setDocumentTitle] = useState(initialTitle);

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
      <Document
        suiteId={uniqueID}
        suiteTitle={documentTitle}
        setSuiteTitle={setDocumentTitle}
      />
      <Footer onZoomChange={handleZoomChange} />
    </div>
  );
};

export default Doc;
