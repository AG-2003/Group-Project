import {
  IconButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IoVideocamOutline,
  IoBarChartOutline,
  IoShareOutline,
} from "react-icons/io5";
import "./NavBar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isSidebarOpen: boolean;
  onToggle: () => void;
  documentTitle: string;
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const NavBar = ({ onToggle, isSidebarOpen, documentTitle, setDocumentTitle }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const iconStyle = {
    transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };
  const handleBlur = () => {
    if (documentTitle.trim() === "") {
      setDocumentTitle("Untitled");
    }
  };

  return (
    <div className="navbarSheet">
      <IconButton
        className="menu-icon-button"
        aria-label="Menu"
        icon={<HamburgerIcon style={iconStyle} />}
        onClick={onToggle}
        colorScheme="purple.100"
      />
      <div className="nav-items">
        <button className="nav-item" onClick={() => { navigate(-1) }}>Home</button>
        <div className="nav-item">File</div>
        <div className="nav-item">Edit</div>
        <div className="nav-item">View</div>
        <div className="nav-item">Insert</div>
        <div className="nav-item">Format</div>
        <div className="nav-item">Tools</div>
        <div className="nav-item">Extensions</div>
        <div className="nav-item">Help</div>
      </div>
      <div className="title-area">
        <input
          className="title-input"
          value={documentTitle}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          placeholder="Untitled"
          aria-label="Document Title"
        />
        <span className="doc-extension">.sheet</span>
      </div>
      <div className="action-buttons">
        <Tooltip
          label="Video Call"
          className="tooltip-label"
          placement="top"
          hasArrow
        >
          <IconButton
            className="action-icon call"
            aria-label="Video Call"
            icon={<IoVideocamOutline />}
            onClick={onOpen}
          />
        </Tooltip>
        <Tooltip
          label="Get Analytics"
          className="tooltip-label"
          placement="top"
          hasArrow
        >
          <IconButton
            className="action-icon analytics"
            aria-label="Analyse"
            icon={<IoBarChartOutline />}
            onClick={onOpen}
          />
        </Tooltip>
        <Tooltip
          label="Share"
          className="tooltip-label"
          placement="top"
          hasArrow
        >
          <IconButton
            className="action-icon share"
            aria-label="share"
            icon={<IoShareOutline />}
            onClick={onOpen}
          />
        </Tooltip>
      </div>
    </div >
  );
};

export default NavBar;
