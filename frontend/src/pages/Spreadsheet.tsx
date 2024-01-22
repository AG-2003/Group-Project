import React, { useState } from "react";
import Sheet from "../components/Spreadsheet/Sheet"; // Adjust the path as needed
import NavBar from "../components/Spreadsheet/NavBar";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Spreadsheet: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTitle = decodeURIComponent(params.get('title') || '');
  const uniqueID = decodeURIComponent(params.get('id') || '');
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
        suiteTitle={documentTitle}
        suiteId={uniqueID}
      />
    </div>
  );
};

export default Spreadsheet;
