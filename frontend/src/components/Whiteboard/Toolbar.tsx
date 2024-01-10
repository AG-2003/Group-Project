import React from "react";
import {
  FaPen,
  FaEraser,
  FaTextHeight,
  FaTrash,
  FaUndo,
  FaRedo,
  FaRegSquare,
  // FaRegCircle,
  // FaSlash,
  FaMousePointer,
} from "react-icons/fa"; // Import necessary icons
import { FaDroplet, FaSliders } from "react-icons/fa6";

import "./Toolbar.scss";

type Tool = "pen" | "eraser" | "text" | "clear" | "pointer";
type Shape = "rectangle" | "circle" | "line";

interface ToolbarProps {
  tool: string;
  undoStack: any[];
  redoStack: any[];
  handleToolChange: (tool: Tool | Shape) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  toggleColorPicker: () => void;
  handleSizeClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  undoStack,
  redoStack,
  handleToolChange,
  handleUndo,
  handleRedo,
  toggleColorPicker,
  handleSizeClick,
}) => {
  return (
    <div className="toolbar">
      <button
        className={`tool-button ${tool === "pointer" ? "selected" : ""}`}
        onClick={() => handleToolChange("pointer")}
      >
        <FaMousePointer />
      </button>
      <button
        onClick={handleUndo}
        disabled={undoStack.length === 0}
        className="tool-button"
      >
        <FaUndo />
      </button>
      <button
        onClick={handleRedo}
        disabled={redoStack.length === 0}
        className="tool-button"
      >
        <FaRedo />
      </button>
      <button
        className={`tool-button ${tool === "pen" ? "selected" : ""}`}
        onClick={() => handleToolChange("pen")}
      >
        <FaPen />
      </button>
      <button
        className={`tool-button ${tool === "eraser" ? "selected" : ""}`}
        onClick={() => handleToolChange("eraser")}
      >
        <FaEraser />
      </button>
      <button
        className={`tool-button ${tool === "text" ? "selected" : ""}`}
        onClick={() => handleToolChange("text")}
      >
        <FaTextHeight />
      </button>
      <div className="shape-buttons">
        <button
          className={`tool-button ${tool === "rectangle" ? "selected" : ""}`}
          onClick={() => handleToolChange("rectangle")}
        >
          <FaRegSquare />
        </button>
        {/* <button
          className="tool-button"
          onClick={() => handleToolChange("circle")}
        >
          <FaRegCircle />
        </button>
        <button
          className="tool-button"
          onClick={() => handleToolChange("line")}
        >
          <FaSlash />
        </button> */}
      </div>
      <button className="tool-button" onClick={toggleColorPicker}>
        <FaDroplet />
      </button>
      <button className="tool-button" onClick={handleSizeClick}>
        <FaSliders />
      </button>
      <button className="tool-button" onClick={() => handleToolChange("clear")}>
        <FaTrash />
      </button>
    </div>
  );
};

export default Toolbar;
