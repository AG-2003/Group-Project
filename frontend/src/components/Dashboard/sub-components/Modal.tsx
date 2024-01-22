// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Modal.css"; // Assuming the CSS is in a file named Modal.css

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: (title: string) => void;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
//   const navigate = useNavigate(); // Hook to get the navigate function
//   const [title, setTitle] = useState("");

//   if (!isOpen) return null;

//   const handleOkClick = () => {
//     onConfirm(title);
//     setTitle(""); // Clear the title after confirmation
//     navigate("/Board");
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="modal">
//         <div className="modal-header">
//           <h4>Add a Document</h4>
//           <button className="close-button" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <input
//           className="modal-input"
//           type="text"
//           placeholder="Enter the Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <div className="modal-footer">
//           <button className="ok-button" onClick={handleOkClick}>
//             OK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";
import { v4 as uuidv4 } from 'uuid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: string; // Add this prop to determine the modal type
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, modalType }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleOkClick = () => {
    const uniqueID = uuidv4()
    // Depending on the modal type, navigate to different routes
    switch (modalType) {
      case "Doc":
        navigate(`/doc/?id=${encodeURIComponent(uniqueID)}`, { state: { title} });
        break;
      case "Slide":
        navigate("/slides", { state: { title, uniqueID } });
        break;
      case "Spreadsheet":
        navigate(`/sheet/?id=${encodeURIComponent(uniqueID)}`, { state: { title} });
        break;
      case "Whiteboard":
        navigate(`/board/?id=${encodeURIComponent(uniqueID)}`, { state: { title} });
        break;
      default:
        // Default action or error handling
        console.error("Unknown modal type");
    }
    setTitle(""); // Clear the title
    onClose(); // Close the modal
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h4>{`Add a ${modalType}`}</h4>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <input
          className="modal-input"
          type="text"
          placeholder={`Enter the Title for ${modalType}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-footer">
          <button className="ok-button" onClick={handleOkClick}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
