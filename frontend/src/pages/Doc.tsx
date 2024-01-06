// import React, { useState } from "react";
// import NavBar from "../components/Doc_/NavBar";
// import ToolBar from "../components/Doc_/ToolBar";
// import Document from "../components/Doc_/Document";
// import Footer from "../components/Doc_/Footer";
// import "./Doc.scss"; // Make sure you import Doc.scss here

// const Doc: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const handleZoomChange = (newZoomLevel: number) => {
//     // Logic to update document size
//     // For example:
//     // documentContainer.style.transform = `scale(${newZoomLevel / 100})`;
//   };

//   return (
//     <div className="doc-container">
//       <NavBar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
//       <ToolBar />
//       <Document />
//       <Footer onZoomChange={handleZoomChange} />
//     </div>
//   );
// };

// export default Doc;

// Doc.tsx
import React, { useRef, useState } from "react";
import { Editor, EditorState } from "draft-js";
import NavBar from "../components/Doc_/NavBar";
import ToolBar from "../components/Doc_/ToolBar";
import Document from "../components/Doc_/Document";
import Footer from "../components/Doc_/Footer";

const Doc: React.FC = () => {
  const editorRef = useRef<Editor>(null); // Add this line to create a ref

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleZoomChange = (newZoomLevel: number) => {
    // Implement zoom functionality
  };

  return (
    <div>
      <NavBar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <ToolBar
        editorState={editorState}
        setEditorState={setEditorState}
        editorRef={editorRef}
      />
      <Document
        editorState={editorState}
        setEditorState={setEditorState}
        editorRef={editorRef}
      />
      <Footer onZoomChange={handleZoomChange} />
    </div>
  );
};

export default Doc;
