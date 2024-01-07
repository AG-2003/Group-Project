import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "../components/Whiteboard/Canvas"; // Adjust the path as needed
import NavBar from "../components/Whiteboard/NavBar";

const container = document.getElementById("root");
const root = createRoot(container!); // Non-null assertion operator
root.render(<Canvas />);

const Whiteboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div>
      <NavBar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Canvas />
    </div>
  );
};

export default Whiteboard;
