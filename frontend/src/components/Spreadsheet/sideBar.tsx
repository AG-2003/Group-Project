import { Button, Spacer, VStack, useDisclosure } from "@chakra-ui/react";
import {
  IoVideocamOutline,
  IoBarChartOutline,
  IoShareOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interfaces/Message";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config";
import { serverTimestamp } from "firebase/firestore";

interface Props {
  onNavigate: (arg: string) => void;
}
const SideBar = ({ onNavigate }: Props) => {
  const navigate = useNavigate(); // Hook for navigation
  const [user] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function randomID(len: number) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  const handleStartCall = () => {
    // Generate the roomID and construct the meeting link
    const roomID = randomID(5);
    const meetingLink =
      window.location.protocol +
      "//" +
      window.location.host +
      "/meeting?roomID=" +
      roomID;

    // Navigate to the Zoom meeting page
    navigate(`/meeting?roomID=${roomID}`);

    // Now you can send the meeting link to the chat or use it as needed
    // For example, you can add a new message to the chat
    const newMessage: Message = {
      id: Date.now().toString(),
      text: meetingLink,
      userId: user?.email,
      timestamp: serverTimestamp(),
      userPic: user?.photoURL,
      userName: user?.displayName,
    };

    // Add the new message to the chat
  };

  // Function to go back
  const goBack = () => {
    navigate(-1); // Go back to previous page
  };
  return (
    <VStack spacing={4} align="stretch" className="body">
      <Button
        variant="ghost"
        justifyContent="flex-start"
        onClick={goBack}
      >
        Home
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        File
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        View
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        Insert
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        Format
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        Tools
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        Extensions
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        //onClick={() => onNavigate("account")}
      >
        Help
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<IoVideocamOutline />}
        onClick={handleStartCall}
      >
        Video Call
      </Button>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<IoBarChartOutline />}
        onClick={onOpen}
      >
        Get Analytics
      </Button>
      x<Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<IoShareOutline />}
        onClick={onOpen}
      >
        Share
      </Button>

      <Spacer /> {/* This will push your go back button to the bottom */}
    </VStack>
  );
};

export default SideBar;