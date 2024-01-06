// import React from "react";
// import "./NavBar.scss";
// import { FaBars, FaCloudUploadAlt, FaShareSquare } from "react-icons/fa"; // Import FontAwesome icons

// const NavBar: React.FC = () => {
//   return (
//     <div className="navbar">
//       <FaBars className="sidebar-icon" />
//       <div className="nav-items">
//         <div className="nav-item">Home</div>
//         <div className="nav-item">File</div>
//         <div className="nav-item">Edit</div>
//         <div className="nav-item">View</div>
//         <div className="nav-item">Insert</div>
//         <div className="nav-item">Format</div>
//         <div className="nav-item">Tools</div>
//         <div className="nav-item">Extensions</div>
//         <div className="nav-item">Help</div>
//       </div>
//       <div className="title-area">Untitled - Doc</div>
//       <div className="action-buttons">
//         <FaCloudUploadAlt className="action-icon" />
//         <FaShareSquare className="action-icon" />
//       </div>
//     </div>
//   );
// };

// export default NavBar;

import {
  IconButton,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
// import { Link } from "react-router-dom";
import { useState } from "react";

interface Props {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const NavBar = ({ onToggle, isSidebarOpen }: Props) => {
  const iconStyle = {
    transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  };

  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      p={1}
      height="30px"
      bg={"#484c6c"}
    >
      <IconButton
        bg="inherit"
        aria-label="Menu"
        fontSize="20px"
        color="white"
        colorScheme="purple.100"
        icon={<HamburgerIcon style={iconStyle} />}
        onClick={onToggle}
      />

      <Flex alignItems="center"></Flex>
    </Flex>
  );
};

export default NavBar;
