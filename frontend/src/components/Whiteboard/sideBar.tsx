import { Button, Spacer, VStack, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Input,} from "@chakra-ui/react";
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
  const {
    isOpen: isShareModalOpen,
    onOpen: onShareModalOpen,
    onClose: onShareModalClose,
  } = useDisclosure();

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

  const getShareableLink = () => {
    const currentUrl = window.location.href;
    // Replace /doc/ with /doc/share/ in the URL
    return currentUrl.replace("/board/", "/board/share/");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink()).then(() => {
      // You can add a notification or feedback to the user here
      console.log("Copied to clipboard");
      onShareModalClose()
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Function to go back
  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <>
      <VStack spacing={4} align="stretch" className="body">
        <Button variant="ghost" justifyContent="flex-start" onClick={goBack}>
          Home
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
          leftIcon={<IoShareOutline />}
          onClick={onShareModalOpen}
        >
          Share
        </Button>
        <Spacer /> {/* This will push your go back button to the bottom */}
      </VStack>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this WhiteBoard</ModalHeader>
          <ModalBody>
            <p>
              Anyone who has the following link will have access to the board.
            </p>
            <Input value={getShareableLink()} isReadOnly my={4} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={copyToClipboard}>
              Copy Link
            </Button>
            <Button variant="ghost" onClick={onShareModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideBar;