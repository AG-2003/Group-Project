import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css"; // Assuming the CSS is in a file named Modal.css

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const navigate = useNavigate(); // Hook to get the navigate function
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleOkClick = () => {
    onConfirm(title);
    setTitle(""); // Clear the title after confirmation
    // navigate("/Doc"); // Navigate to the Docs page
    navigate("/Board"); // Navigate to the Docs page
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h4>Add a Document</h4>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <input
          className="modal-input"
          type="text"
          placeholder="Enter the Title"
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
