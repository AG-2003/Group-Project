import { Button, Spacer, VStack } from "@chakra-ui/react";
import {
  ArrowBackIcon,
  SearchIcon,
  LockIcon,
  ViewIcon,
  InfoOutlineIcon,
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
        leftIcon={<SearchIcon />}
        onClick={() => onNavigate("account")}
      >
        Community Information
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<LockIcon />}
        onClick={() => onNavigate("security")}
      >
        Leave Community
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<ViewIcon />}
        onClick={() => onNavigate("preferences")}
      >
        Members List
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
