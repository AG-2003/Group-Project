// import React, { useContext } from 'react'
// import {signOut} from "firebase/auth"
// import { auth } from '../../firebase-config'
// import { AuthContext } from '../../context/AuthContext'

// const Navbar = () => {
//   const {currentUser} = useContext(AuthContext)

//   return (
//     <div className='navbar'>
//       <span className="logo">Chats</span>
//       <div className="user">
//         <img src={currentUser.photoURL} alt="" />
//         <span>{currentUser.displayName}</span>
//         <button onClick={()=>signOut(auth)}>logout</button>
//       </div>
//     </div>
//   )
// }

// export default Navbar

import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.scss";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chats</span>
      {currentUser ? (
        <div className="user">
          <img
            src={currentUser.photoURL || ""}
            alt={currentUser.displayName || "User"}
          />
          <span>{currentUser.displayName}</span>
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>
      ) : (
        <div className="user">
          <span>No user</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;
