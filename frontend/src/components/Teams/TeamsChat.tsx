import { Avatar, Box, Button, Flex, Input, Text } from "@chakra-ui/react";
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

interface Message {
  id: string;
  text: any;
  userId: string | null | undefined;
  userPic: any;
  userName: any;
  timestamp: any;
}

interface Props {
  teamId: string;
}

const ChattingPage: React.FC<Props> = ({ teamId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [user] = useAuthState(auth);

  // Get the messages stuff
  useEffect(() => {
    const messagesCollection = collection(db, "teamsChat", teamId, "messages");
    const messagesQuery = query(messagesCollection, orderBy("timestamp"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const updatedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        updatedMessages.push(doc.data() as Message);
      });
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [teamId]);

  // Get the teams stuff
  const [teamDetails, setTeamDetails] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const teamDocRef = doc(db, "teams", teamId);
        const teamDocSnapshot = await getDoc(teamDocRef);

        if (teamDocSnapshot.exists()) {
          setTeamDetails(teamDocSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  const handleSendMessage = async () => {
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
        const messagesCollection = collection(
          db,
          "teamsChat",
          teamId,
          "messages"
        );
        await addDoc(messagesCollection, newMessage);
        setMessageInput("");
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
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleSendMessage}>Send</Button>
        <Button>Send File</Button>
      </Flex>
    </Box>
  );
};

export default ChattingPage;
