import Sidebar from "../components/Chats/Sidebar";
import Chatbox from "../components/Chats/Chat";
import "./Chat.scss";

const Chat = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chatbox />
      </div>
    </div>
  );
};

export default Chat;
