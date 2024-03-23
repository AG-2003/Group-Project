import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";
import { v4 as uuidv4 } from 'uuid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: string; // Add this prop to determine the modal type
  team_id: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, modalType, team_id }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleOkClick = () => {
    const uniqueID = uuidv4()
    // Depending on the modal type, navigate to different routes
    switch (modalType) {
      case "Doc":
        navigate(`/doc/share-teams/?id=${encodeURIComponent(uniqueID)}`, { state: { title, team_id} });
        break;
      case "Whiteboard":
        navigate(`/board/share/?id=${encodeURIComponent(uniqueID)}`, { state: { title} });
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
