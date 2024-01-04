import React from "react";
import NavBar from "../components/Doc_/NavBar";
import Toolbar from "../components/Doc_/Toolbar";
import Document from "../components/Doc_/Document";
import "./Doc.scss";

const Doc: React.FC = () => {
  return (
    <div className="document-editor">
      <NavBar />
      <Toolbar />
      <div className="editor-content">
        <Document />
      </div>
    </div>
  );
};

export default Doc;
