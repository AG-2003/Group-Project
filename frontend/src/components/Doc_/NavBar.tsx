import React from "react";
import "./NavBar.scss";

const NavBar: React.FC = () => {
  return (
    <div className="navbar">
      {/* Add your navigation bar items here */}
      <div className="nav-item">File</div>
      <div className="nav-item">Edit</div>
      <div className="nav-item">View</div>
      {/* ... other navigation items */}
    </div>
  );
};

export default NavBar;
