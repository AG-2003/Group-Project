import { VStack, Button } from "@chakra-ui/react";
import {
  ViewIcon,
  CalendarIcon,
  PhoneIcon,
  ChatIcon,
  DeleteIcon,
  AtSignIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { FaHouse } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
  const nav = useNavigate();

  return (
    <VStack spacing={4} align="stretch" className="body">
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FaHouse />}
        paddingLeft={5}
        className="sidebar-button" // Added className for SCSS targeting
        onClick={() => {
          nav("/Home");
        }}
      >
        Home
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<EditIcon />}
        className="sidebar-button" // Added className for SCSS targeting
        paddingLeft={5}
        onClick={() => {
          nav("/Projects");
        }}
      >
        Projects
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        className="sidebar-button" // Added className for SCSS targeting
        leftIcon={<ViewIcon />}
        paddingLeft={5}
        onClick={() => {
          nav("/Templates");
        }}
      >
        Templates
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        className="sidebar-button" // Added className for SCSS targeting
        leftIcon={<AtSignIcon />}
        paddingLeft={5}
        onClick={() => {
          nav("/Teams");
        }}
      >
        Teams
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        className="sidebar-button" // Added className for SCSS targeting
        leftIcon={<PhoneIcon />}
        paddingLeft={5}
        onClick={() => {
          nav("/Calls");
        }}
      >
        Calls
      </Button>
      <Button
        variant="ghost"
        className="sidebar-button" // Added className for SCSS targeting
        justifyContent="flex-start"
        leftIcon={<CalendarIcon />}
        paddingLeft={5}
        onClick={() => {
          nav("/Calendar");
        }}
      >
        Calendar
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        className="sidebar-button" // Added className for SCSS targeting
        leftIcon={<ChatIcon />}
        paddingLeft={5}
        onClick={() => {
          nav("/communities/all_posts");
        }}
      >
        Social
      </Button>
      <Button
        variant="ghost"
        className="sidebar-button" // Added className for SCSS targeting
        justifyContent="flex-start"
        leftIcon={<DeleteIcon />}
        paddingLeft={5}
        onClick={() => {
          nav("/Trash");
        }}
      >
        Trash
      </Button>
    </VStack>
  );
};

export default Sidebar;
