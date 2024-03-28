import {
  Button,
  Spacer,
  VStack,
  useDisclosure,
  PopoverHeader,
  PopoverBody,
  UnorderedList,
  ListItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverFooter,
  PopoverCloseButton,
  InputGroup,
  Input,
  InputRightElement,
  IconButton
} from "@chakra-ui/react";
import {
  IoVideocamOutline,
  IoShareOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interfaces/Message";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config";
import { serverTimestamp } from "firebase/firestore";
import { CopyIcon } from "@chakra-ui/icons";

interface Props {
  onNavigate: (arg: string) => void;
}
const SideBar = ({ onNavigate }: Props) => {
  const navigate = useNavigate(); // Hook for navigation
  const [user] = useAuthState(auth);
  const { isOpen: isPopoverOpen, onOpen: onOpenPopover, onClose: onClosePopover } = useDisclosure();
  const isTeams = window.location.pathname.includes("/doc/share-teams");

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

  // Function to modify the URL
  const getShareableLink = () => {
    const currentUrl = window.location.href;
    // Replace /doc/ with /doc/share/ in the URL
    return isTeams? currentUrl : currentUrl.replace("/doc/", "/doc/share/");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink()).then(() => {
      // You can add a notification or feedback to the user here
      console.log("Copied to clipboard");
      onClosePopover()
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
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
        leftIcon={<IoVideocamOutline />}
        onClick={handleStartCall}
      >
        Video Call
      </Button>
      <Popover isOpen={isPopoverOpen} onClose={onClosePopover}>
        <PopoverTrigger>
            <Button
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={<IoShareOutline />}
              onClick={onOpenPopover}
            >
              Share
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Please note:</PopoverHeader>
            <PopoverBody>
              <UnorderedList spacing={2}>
                <ListItem>This document's shareable link grants access to anyone in possession of it. Handle with care.</ListItem>
                <ListItem>To ensure no loss of content, the document's owner MUST manually paste this link before the document's shareable link is distributed.</ListItem>
              </UnorderedList>
              <InputGroup size="md" mt={4} >
                <Input
                    pr="4.5rem"
                    value={getShareableLink()}
                    _hover={{cursor: 'pointer' }}
                    fontFamily="mono"
                    bgColor={"#f0f4f4"}
                    onClick={copyToClipboard}
                    isReadOnly
                  />
                <InputRightElement width="4.5rem">
                  <IconButton
                      aria-label="Copy link"
                      icon={<CopyIcon />}
                      variant="ghost"
                      onClick={copyToClipboard}
                    />
                </InputRightElement>
              </InputGroup>
            </PopoverBody>
            <PopoverFooter>
            <Button colorScheme="purple" mr={3} onClick={copyToClipboard} _hover={{ bgColor: "purple.600" }} w="100%">
                Copy Link
              </Button>
            </PopoverFooter>
        </PopoverContent>
        </Popover>

      <Spacer /> {/* This will push your go back button to the bottom */}
    </VStack>
  );
};

export default SideBar;
