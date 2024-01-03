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

interface Props {
  onButtonClick: (arg: string) => void;
}

const Sidebar = ({ onButtonClick }: Props) => {
  const handleClick = (component: string) => {
    onButtonClick(component);
  };

  return (
    <VStack spacing={4} align="stretch" className="body">
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FaHouse />}
        paddingLeft={5}
        onClick={() => handleClick("Profile")}
      >
        Home
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<EditIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Projects")}
      >
        Projects
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<ViewIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Templates")}
      >
        Templates
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<AtSignIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Teams")}
      >
        Teams
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<PhoneIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Calls")}
      >
        Calls
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<CalendarIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Calendar")}
      >
        Calendar
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<ChatIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Social")}
      >
        Social
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<DeleteIcon />}
        paddingLeft={5}
        onClick={() => handleClick("Trash")}
      >
        Trash
      </Button>
    </VStack>
  );
};

export default Sidebar;
