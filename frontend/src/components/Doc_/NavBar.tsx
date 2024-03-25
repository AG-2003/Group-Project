import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  IconButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IoVideocamOutline,
  IoBarChartOutline,
  IoShareOutline,
} from "react-icons/io5";
import "./NavBar.scss";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interfaces/Message";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";


interface Props {
  isSidebarOpen: boolean;
  onToggle: () => void;
  documentTitle: string;
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}



const NavBar = ({ onToggle, isSidebarOpen, documentTitle, setDocumentTitle }: Props) => {
  const isSharePage = window.location.pathname.includes("/doc/share") || window.location.pathname.includes("/doc/share-teams");
  const isTeams = window.location.pathname.includes("/doc/share-teams");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isShareModalOpen, onOpen: onShareModalOpen, onClose: onShareModalClose } = useDisclosure();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const iconStyle = {
    transform: isSidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };
  const handleBlur = () => {
    if (documentTitle.trim() === "") {
      setDocumentTitle("Untitled");
    }
  };

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



  // Function to start the call
  // const handleStartCall = () => {
  //   // Generate the roomID and construct the meeting link
  //   const roomID = randomID(5);
  //   const meetingLink =
  //     window.location.protocol +
  //     "//" +
  //     window.location.host +
  //     "/meeting?roomID=" +
  //     roomID;

  //   // Navigate to the Zoom meeting page
  //   navigate(`/meeting?roomID=${roomID}`);

  //   // Now you can send the meeting link to the chat or use it as needed
  //   // For example, you can add a new message to the chat
  //   const newMessage: Message = {
  //     id: Date.now().toString(),
  //     text: meetingLink,
  //     userId: user?.email,
  //     timestamp: serverTimestamp(),
  //     userPic: user?.photoURL,
  //     userName: user?.displayName,
  //   };

  //   // Add the new message to the chat

  // };

  const handleStartCall = () => {
    // Generate the roomID and construct the meeting link
    const roomID = randomID(5);
    const meetingLink =
      window.location.protocol +
      "//" +
      window.location.host +
      "/meeting?roomID=" +
      roomID;

    // Open the meeting link in a new tab
    window.open(meetingLink, '_blank');

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

  // Function to modify the URL
  const getShareableLink = () => {
    const currentUrl = window.location.href;
    // Replace /doc/ with /doc/share/ in the URL
    return isTeams? currentUrl : currentUrl.replace("/doc/", "/doc/share/");
  };

  // Function to copy the current URL to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink()).then(() => {
      // You can add a notification or feedback to the user here
      console.log("Copied to clipboard");
      onShareModalClose()
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);

  return (
    <div className="navbarD">
      {!isDesktop && (
      <IconButton
        className="menuIcon-Dash"
        aria-label="Menu"
        icon={<HamburgerIcon style={iconStyle} />}
        onClick={onToggle}
      />
      )}
      <div className="nav-items">
        <button className="nav-item" onClick={() => { isSharePage? (isTeams? navigate(-1) : navigate('/projects')) : navigate(-1) }}>Home</button>
      </div>
      <div className="title-area">
        <input
          className="title-input"
          value={documentTitle}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          placeholder="Untitled"
          aria-label="Document Title"
        />
        <span className="doc-extension">.doc</span>
      </div>
      <div className="action-buttons">
        <Tooltip
          label="Video Call"
          className="tooltip-label"
          placement="top"
          hasArrow
        >
          <IconButton
            className="action-icon call"
            aria-label="Video Call"
            icon={<IoVideocamOutline />}
            onClick={handleStartCall}
          />
        </Tooltip>
        <Tooltip
          label="Share"
          className="tooltip-label"
          placement="top"
          hasArrow
        >
          <IconButton
            className="action-icon share"
            aria-label="share"
            icon={<IoShareOutline />}
            onClick={onShareModalOpen}
          />
        </Tooltip>
      </div>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Document</ModalHeader>
          <ModalBody>
            <p>Anyone who has the following link will have access to the document.</p>
            <Input value={getShareableLink()} isReadOnly my={4} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={copyToClipboard}>
              Copy Link
            </Button>
            <Button variant="ghost" onClick={onShareModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NavBar;