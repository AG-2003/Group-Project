import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase-config";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import "./TeamsChat.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Linkify from "react-linkify";
import { Message } from "../../interfaces/Message";
import chatBG from '../../assets/chatBG.png'

// import { FaFilePdf } from "react-icons/fa";
import Navbar from "../Dashboard/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "../Dashboard/sidebar";
import { BsFillSendFill } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa6";

const ChattingPage: React.FC = () => {
  // Dashboard routing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "0px" },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [user] = useAuthState(auth);
  const history = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  let { team_id } = useParams();
  console.log("Team ID:", team_id);

  if (team_id) {
    team_id = decodeURIComponent(team_id);
  }

  // Get the messages stuff
  useEffect(() => {
    if (team_id) {
      const messagesCollection = collection(
        db,
        "teamsChat",
        team_id,
        "messages"
      );
      const messagesQuery = query(messagesCollection, orderBy("timestamp"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const updatedMessages: Message[] = [];
        snapshot.forEach((doc) => {
          updatedMessages.push(doc.data() as Message);
        });
        setMessages(updatedMessages);
      });

      return () => unsubscribe();
    }
  }, [team_id]);

  // Get the teams stuff
  const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        if (team_id) {
          const teamDocRef = doc(db, "teams", team_id);
          const teamDocSnapshot = await getDoc(teamDocRef);

          if (teamDocSnapshot.exists()) {
            setTeamDetails(teamDocSnapshot.data());
          }
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, [team_id]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        userId: user?.email,
        timestamp: serverTimestamp(),
        userPic: user?.photoURL,
        userName: user?.displayName,
      };

      try {
        if (team_id) {
          const messagesCollection = collection(
            db,
            "teamsChat",
            team_id,
            "messages"
          );
          await addDoc(messagesCollection, newMessage);
          setMessageInput("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSendFile = async () => {
    // Trigger the file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      try {
        if (team_id) {
          const storage = getStorage();
          const storagePath = `teamFiles/${team_id}/${file.name}`;
          const fileRef = ref(storage, storagePath);
          await uploadBytes(fileRef, file);

          const downloadURL = await getDownloadURL(fileRef);

          const newMessage: Message = {
            id: Date.now().toString(),
            text: downloadURL, // Use downloadURL as the message text for file sharing
            userId: user?.email,
            timestamp: serverTimestamp(),
            userPic: user?.photoURL,
            userName: user?.displayName,
          };

          const messagesCollection = collection(
            db,
            "teamsChat",
            team_id,
            "messages"
          );

          await addDoc(messagesCollection, newMessage);
        }
      } catch (error) {
        console.error("Error sending file:", error);
      }
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
    history(`/meeting?roomID=${roomID}`);

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
    if (team_id) {
      const messagesCollection = collection(
        db,
        "teamsChat",
        team_id,
        "messages"
      );
      addDoc(messagesCollection, newMessage);
    }
  };

  return (
    <>
      <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
      <Box display="flex" height="calc(100vh - 10px)">
        <AnimatePresence>
          {isSidebarOpen ? (
            <motion.div
              initial="open"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                paddingTop: "10px",
                height: "inherit",
                backgroundColor: "#f6f6f6",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <SideBar />
            </motion.div>
          ) : (
            <motion.div
              initial="closed"
              animate="clsoed"
              exit="open"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                paddingTop: "10px",
                height: "inherit",
                backgroundColor: "#f6f6f6",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <SideBar />
            </motion.div>
          )}
        </AnimatePresence>
        <Box bgImage={chatBG} bgRepeat='no-repeat' content="cover" bgPosition='center' bgSize='cover' flexGrow={1} padding="10px" marginLeft={5}>
          <Box className="chatting-page">
            {/* Team Header */}
            <Flex className="team-header">
              <Avatar
                className="team-avatar"
                src={teamDetails ? teamDetails.image : "fallback_image_url"}
                name={teamDetails ? teamDetails.name : "fallback_image_url"}
                borderRadius="10%"
              />
              <Text className="team-name">
                {teamDetails ? teamDetails.name : "fallback_image_url"}
              </Text>
              <Button className="call-button" onClick={handleStartCall}>
                Start a call
              </Button>
            </Flex>

            {/* Chat Area */}
            <Box className="chat-area">
              {messages.map((message) => (
                <Flex
                  key={message.id}
                  className={
                    message.userId === user?.email
                      ? "sent-message"
                      : "received-message"
                  }
                >
                  {message.userId !== user?.email && (
                    <Avatar
                      className="message-avatar"
                      src={message.userPic}
                      name={message.userName}
                      borderRadius="50%"
                    />
                  )}
                  {/* Rendering logic for different types of messages */}
                  {message.text.startsWith(
                    "https://firebasestorage.googleapis.com"
                  ) ? (
                    // It's a file message
                    <Box
                      bg={
                        message.userId === user?.email
                          ? "sent-message"
                          : "recieved-message"
                      }
                      p={4}
                      borderRadius="lg"
                      maxW="300px" // Adjust the maximum width as needed
                    >
                      <a
                        href={message.text}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={message.text}
                          alt="File Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "150px",
                            borderRadius: "8px",
                          }}
                        />
                      </a>
                    </Box>
                  ) : (
                    // It's a text message
                    <Text className="message-text">
                      <Linkify>{message.text}</Linkify>
                    </Text>
                  )}
                </Flex>
              ))}
            </Box>
            <Flex className="text-input-bar" align="center">
              <FormControl
                as="form"
                onSubmit={handleSendMessage}
                display="flex"
                alignItems="center"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  mr="2"
                />
                <IconButton
                  className="TextIcon"
                  aria-label="Send message"
                  icon={<BsFillSendFill />}
                  onClick={handleSendMessage}
                  // style={{ background: "none" }}
                  size="sm"
                  mr="2"
                />
                <IconButton
                  className="TextIcon"
                  aria-label="Attach files"
                  icon={<FaPaperclip />}
                  onClick={() => fileInputRef.current?.click()}
                  // style={{ background: "none" }}
                  size="sm"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </FormControl>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChattingPage;
