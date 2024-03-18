import { useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiFileText, FiGrid, FiClipboard, FiAward } from "react-icons/fi";
import { LuPresentation } from "react-icons/lu";
import { FaPlus, FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./sub-components/Modal";
import { UseUserProfilePic } from "../../hooks/UseUserProfilePic";
import { useNavigate } from "react-router-dom";
import "./NavBarDash.scss"

interface Props {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const NavBar = ({ onToggle, isSidebarOpen }: Props) => {
  const iconStyle = {
    transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  };

  // State to control the visibility and type of the modal
  const [modalType, setModalType] = useState("");

  const navigate = useNavigate();

  // Function to open the modal
  const openModal = (type: string) => setModalType(type);

  // Function to close the modal
  const closeModal = () => setModalType("");

  // Function to handle the confirmation (submit) of the modal
  // const handleConfirm = () => closeModal(); // Close the modal after submission

  const userProfile = UseUserProfilePic();

  return (
    <div className="navBar-Dash">
      <IconButton
        className="menuIcon-Dash"
        aria-label="Menu"
        icon={<HamburgerIcon style={iconStyle} />}
        onClick={onToggle}
      />

      <div className="rightSection-Dash">
        <Modal
          isOpen={modalType !== ""}
          onClose={closeModal}
          modalType={modalType}
        />

        <Menu>
        <MenuButton as={IconButton} aria-label="Options" icon={<FaPlus />} className="menuButton-Dash" />
          <MenuList>
            <MenuItem icon={<FiFileText />} onClick={() => openModal("Doc")}>Doc</MenuItem>
            <MenuItem icon={<LuPresentation />} onClick={() => openModal("Slide")}>Slide</MenuItem>
            <MenuItem icon={<FiGrid />} onClick={() => openModal("Spreadsheet")}>Spreadsheet</MenuItem>
            <MenuItem icon={<FiClipboard />} onClick={() => openModal("Whiteboard")}>Whiteboard</MenuItem>
          </MenuList>
        </Menu>

        <IconButton
          size="sm"
          onClick={() => { navigate('/friends') }}
          mr={4}
          colorScheme="purple"
          icon={<FaUserFriends />}
          aria-label={"friends"}
        />

        <IconButton
          className="badgeIcon-Dash"
          aria-label="badge"
          icon={<FiAward />}
          onClick={() => { navigate('/Badges') }}
        />

        <Link to="/settings">
          <Avatar
            className="userAvatar-Dash"
            src={userProfile.photoURL || "fallback_image_url"}
            name={userProfile.displayName}
            backgroundColor={"#484c6c"}
          />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
