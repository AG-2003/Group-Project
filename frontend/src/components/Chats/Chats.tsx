// import { doc, onSnapshot } from "firebase/firestore";
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { ChatContext } from "../../context/ChatContext";
// import { db } from "../../firebase-config";

// const Chats = () => {
//   const [chats, setChats] = useState([]);

//   const { currentUser } = useContext(AuthContext);
//   const { dispatch } = useContext(ChatContext);

//   useEffect(() => {
//     const getChats = () => {
//       const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
//         setChats(doc.data());
//       });

//       return () => {
//         unsub();
//       };
//     };

//     currentUser.uid && getChats();
//   }, [currentUser.uid]);

//   const handleSelect = (u) => {
//     dispatch({ type: "CHANGE_USER", payload: u });
//   };

//   return (
//     <div className="chats">
//       {Object.entries(chats)
//         ?.sort((a, b) => b[1].date - a[1].date)
//         .map((chat) => (
//           <div
//             className="userChat"
//             key={chat[0]}
//             onClick={() => handleSelect(chat[1].userInfo)}
//           >
//             <img src={chat[1].userInfo.photoURL} alt="" />
//             <div className="userChatInfo">
//               <span>{chat[1].userInfo.displayName}</span>
//               <p>{chat[1].lastMessage?.text}</p>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default Chats;

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
import "./Chats.scss";

// Define the structure of a chat object
interface Chat {
  date: number; // Adjust the type based on your data structure
  userInfo: {
    displayName: string;
    photoURL: string;
    // ... other user info properties
  };
  lastMessage: {
    text: string;
    // ... other message properties
  };
}

const Chats = () => {
  const [chats, setChats] = useState<{ [key: string]: Chat }>({});

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data() as { [key: string]: Chat });
      });

      return () => {
        unsub();
      };
    }
  }, [currentUser]);

  const handleSelect = (u: Chat["userInfo"]) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map(([key, chat]) => (
          <div
            className="userChat"
            key={key}
            onClick={() => handleSelect(chat.userInfo)}
          >
            <img src={chat.userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat.userInfo.displayName}</span>
              <p>{chat.lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
