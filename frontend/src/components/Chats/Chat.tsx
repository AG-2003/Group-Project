import React, { useContext } from "react";
import Cam from "../../assets/cam.png";
import Add from "../../assets/add.png";
import More from "../../assets/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "./Chat.scss";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext); // Use AuthContext to access currentUser

  // Optional: Check if there is a current user and a chat user
  if (!currentUser || !data.user) {
    return <div>Loading or no chat selected...</div>;
  }

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="Camera" />
          <img src={Add} alt="Add" />
          <img src={More} alt="More" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
