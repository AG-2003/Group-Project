import { Button, Spacer, VStack } from "@chakra-ui/react";
import {
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface Props {
  onNavigate: (arg: string) => void;
}
const SideBar = ({ onNavigate }: Props) => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to go back
  const goBack = () => {
    navigate(-1); // Go back to previous page
  };
  return (
    <VStack spacing={4} align="stretch" className="body">
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Home
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        File
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        View
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Insert
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Format
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Tools
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Extensions
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={() => onNavigate("account")}
      >
        Help
      </Button>

      <Spacer /> {/* This will push your go back button to the bottom */}

      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<ArrowBackIcon />}
        onClick={goBack}
      >
        Go back
      </Button>
    </VStack>
  );
};

export default SideBar;
