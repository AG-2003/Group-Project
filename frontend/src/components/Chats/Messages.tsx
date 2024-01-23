// import { doc, onSnapshot } from "firebase/firestore";
// import React, { useContext, useEffect, useState } from "react";
// import { ChatContext } from "../../context/ChatContext";
// import { db } from "../../firebase-config";
// import Message from "./Message";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const { data } = useContext(ChatContext);

//   useEffect(() => {
//     const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
//       doc.exists() && setMessages(doc.data().messages);
//     });

//     return () => {
//       unSub();
//     };
//   }, [data.chatId]);

//   console.log(messages);

//   return (
//     <div className="messages">
//       {messages.map((m) => (
//         <Message message={m} key={m.id} />
//       ))}
//     </div>
//   );
// };

// export default Messages;

import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase-config";
import Message from "./Message";
import { doc, onSnapshot } from "firebase/firestore";
import "./Messages.scss";

// eslint-disable-next-line @typescript-eslint/no-redeclare
interface Message {
  id: string;
  senderId: string;
  text: string;
  img?: string; // Optional property, include it if your messages can have images
  photoURL?: string; // Optional property for the photo URL of the sender
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const docData = doc.data();
        if (docData && docData.messages) {
          setMessages(docData.messages as Message[]);
        }
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
