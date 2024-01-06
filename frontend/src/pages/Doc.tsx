import React, { useState } from "react";
import NavBar from "../components/Doc_/NavBar";
import ToolBar from "../components/Doc_/ToolBar";
import Document from "../components/Doc_/Document";
// import "./Doc.scss";

const Doc: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //  const [currentComponent, setCurrentComponent] = useState("Profile");

  //  const handleButtonClick = (component: string) => {
  //    setCurrentComponent(component);
  //  };

  // Variants for Framer Motion animation
  //  const sidebarVariants = {
  //    open: { width: "200px" },
  //    closed: { width: "0px" },
  //  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="document-editor">
      <div style={{ padding: "10px", background: "#484c6c" }}>
        <NavBar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <ToolBar />
      <div className="editor-content">
        <Document />
      </div>
    </div>
  );
};

export default Doc;
