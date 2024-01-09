import { useState } from "react";
import {
  IconButton,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiFileText, FiGrid, FiClipboard } from "react-icons/fi";
import { LuPresentation } from "react-icons/lu";
import { Link } from "react-router-dom";
import Modal from "./sub-components/Modal";

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

  // Function to open the modal
  const openModal = (type: string) => setModalType(type);

  // Function to close the modal
  const closeModal = () => setModalType("");

  // Function to handle the confirmation (submit) of the modal
  const handleConfirm = () => closeModal(); // Close the modal after submission

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

      <Flex alignItems="center">
        <Modal
          isOpen={modalType !== ""}
          onClose={closeModal}
          // onConfirm={handleConfirm}
          modalType={modalType}
        />
        <Menu>
          <MenuButton as={Button} colorScheme="purple" mr={4} size="sm">
            Create a design
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiFileText />} onClick={() => openModal("Doc")}>
              Doc
            </MenuItem>
            <MenuItem
              icon={<LuPresentation />}
              onClick={() => openModal("Slide")}
            >
              Slide
            </MenuItem>
            <MenuItem
              icon={<FiGrid />}
              onClick={() => openModal("Spreadsheet")}
            >
              Spreadsheet
            </MenuItem>
            <MenuItem
              icon={<FiClipboard />}
              onClick={() => openModal("Whiteboard")}
            >
              Whiteboard
            </MenuItem>
          </MenuList>
        </Menu>
        <Link to="/settings">
          <Avatar size="sm" as="span" />
        </Link>
      </Flex>
    </Flex>
  );
};

export default NavBar;
