import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  text: any;
  userId: string | null | undefined;
  userPic: any;
  userName: any;
  timestamp: any;
}

const ChattingPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [user] = useAuthState(auth);

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

  return (
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
        <Button className="call-button">Start a call</Button>
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
            <Text className="message-text">{message.text}</Text>
          </Flex>
        ))}
      </Box>

      {/* Text Input Bar */}
      <Flex className="text-input-bar">
        <FormControl as="form" onSubmit={handleSendMessage}>
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button onClick={handleSendMessage}>Send</Button>
          <Button>Send File</Button>
        </FormControl>
      </Flex>
    </Box>
  );
};

export default ChattingPage;
