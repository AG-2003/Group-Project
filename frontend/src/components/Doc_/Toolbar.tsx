import React from "react";
import "./Toolbar.scss";

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      {/* Add your toolbar buttons here */}
      <button className="toolbar-button">B</button>
      <button className="toolbar-button">I</button>
      <button className="toolbar-button">U</button>
      {/* ... other toolbar items */}
    </div>
  );
};

export default Toolbar;
