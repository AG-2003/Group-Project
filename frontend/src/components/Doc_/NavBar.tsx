import { IconButton, Flex, Button, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaCloudUploadAlt, FaShareSquare, FaUser } from "react-icons/fa"; // Import FontAwesome icons
import "./NavBar.scss";

// import { Link } from "react-router-dom";
// import { useState } from "react";

interface Props {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const NavBar = ({ onToggle, isSidebarOpen }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const iconStyle = {
    transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  };

  return (
    <div className="navbar">
      <IconButton
        className="menu-icon-button"
        aria-label="Menu"
        icon={<HamburgerIcon style={iconStyle} />}
        onClick={onToggle}
        colorScheme="purple.100"
      />
      <div className="nav-items">
        <div className="nav-item">Home</div>
        <div className="nav-item">File</div>
        <div className="nav-item">Edit</div>
        <div className="nav-item">View</div>
        <div className="nav-item">Insert</div>
        <div className="nav-item">Format</div>
        <div className="nav-item">Tools</div>
        <div className="nav-item">Extensions</div>
        <div className="nav-item">Help</div>
      </div>
      <div className="title-area">Untitled - Doc</div>
      <div className="action-buttons">
        <IconButton
          className="action-icon upload"
          aria-label="Upload"
          icon={<FaCloudUploadAlt />}
          onClick={onOpen}
        />
        <IconButton
          className="action-icon share"
          aria-label="Share"
          icon={<FaShareSquare />}
          onClick={onOpen}
        />
        <IconButton
          className="action-icon user"
          aria-label="User"
          icon={<FaUser />}
          onClick={onOpen}
        />
      </div>
    </div>
  );
};

export default NavBar;
