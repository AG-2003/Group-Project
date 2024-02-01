import {
  IconButton,
  useDisclosure,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  useClipboard
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


interface Props {
  isSidebarOpen: boolean;
  onToggle: () => void;
  documentTitle: string;
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}



const NavBar = ({ onToggle, isSidebarOpen, documentTitle, setDocumentTitle }: Props) => {
  const { isOpen: shareModalOpen, onOpen: openShareModal, onClose: closeShareModal } = useDisclosure();
  const { hasCopied, onCopy }: { hasCopied: boolean, onCopy: (text: string) => void } = useClipboard(""); // State for clipboard functionality

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

  const handleCopyClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault(); // Prevent default behavior to avoid issues
    onCopy("Yo, someone make this nonsense work");
   };

  const shareLink = (existingUrl : string) => {
    const docIndex = existingUrl.indexOf("/doc") + 4;
    const newUrl = existingUrl.substring(0, docIndex) + "/share" + existingUrl.substring(docIndex);
    return newUrl
  }


  return (
    <div className="navbar">
      <IconButton
        className="menu-icon-button"
        aria-label="Menu"
        icon={<HamburgerIcon style={iconStyle} />}
        onClick={onToggle}
        colorScheme="purple.100"
      />
      <div className="nav-items">
        <button className="nav-item" onClick={() => { navigate(-1) }}>Home</button>
        <div className="nav-item">File</div>
        <div className="nav-item">Edit</div>
        <div className="nav-item">View</div>
        <div className="nav-item">Insert</div>
        <div className="nav-item">Format</div>
        <div className="nav-item">Tools</div>
        <div className="nav-item">Extensions</div>
        <div className="nav-item">Help</div>
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
          label="Get Analytics"
          className="tooltip-label"
          placement="top"
          hasArrow
        >
          <IconButton
            className="action-icon analytics"
            aria-label="Analyse"
            icon={<IoBarChartOutline />}
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
            onClick={openShareModal}
          />
        </Tooltip>
      </div>

       {/* Share Modal */}
       <Modal isOpen={shareModalOpen} onClose={closeShareModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Your Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={hasCopied ? "Copied to clipboard!" : "Copy the link below to share your project"} readOnly border="none"/>
            <Input value={shareLink(window.location.href)} readOnly mt={2}/>
            <Button onClick={handleCopyClick} mt={2} style={{right: "1"}}>
              Someone make this work bruh
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NavBar;
