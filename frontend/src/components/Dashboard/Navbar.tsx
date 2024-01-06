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
import Modal from "./sub-components/Modal"; // Adjust the import path if needed
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

  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Function to handle the confirmation (submit) of the modal
  const handleConfirm = (title: string) => {
    // Handle the title submission here, e.g., create a document
    console.log(title); // Placeholder for your submit logic
    closeModal(); // Close the modal after submission
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

      <Flex alignItems="center">
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
        <Menu>
          <MenuButton as={Button} colorScheme="purple" mr={4} size="sm">
            Create a design
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiFileText />} onClick={openModal}>
              Docs
            </MenuItem>
            <MenuItem icon={<LuPresentation />}>Slides</MenuItem>
            <MenuItem icon={<FiGrid />}>Spreadsheets</MenuItem>
            <MenuItem icon={<FiClipboard />}>Whiteboard</MenuItem>
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
