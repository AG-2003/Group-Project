import { Button, Spacer, VStack } from "@chakra-ui/react";
import {
  ArrowBackIcon,
  SearchIcon,
  LockIcon,
  ViewIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import {
  FaHouse,
  FaChartColumn,
  FaCircleUser,
  FaBookmark,
  FaPeopleGroup,
} from "react-icons/fa6";
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
        leftIcon={<FaHouse />}
        onClick={() => navigate("/communities/all_posts")}
      >
        All posts
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FaCircleUser />}
        onClick={() => navigate("/communities/your_posts")}
      >
        Your posts
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FaBookmark />}
        onClick={() => navigate("/communities/saved_posts")}
      >
        Saved posts
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FaPeopleGroup />}
        onClick={() => navigate("/communities")}
      >
        Community
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
