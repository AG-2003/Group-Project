import React, { useState } from "react";
import Sheet from "../components/Spreadsheet/Sheet"; // Adjust the path as needed
import NavBar from "../components/Spreadsheet/NavBar";
import Toolbar from "../components/Spreadsheet/Toolbar";

const Whiteboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <NavBar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sheet />
    </div>
  );
};

export default Whiteboard;
