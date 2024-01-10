import React from "react";
import {
  FaPen,
  FaEraser,
  FaTextHeight,
  FaTrash,
  FaUndo,
  FaRedo,
} from "react-icons/fa"; // Import necessary icons
import { FaDroplet, FaSliders } from "react-icons/fa6";
import { FaSquare, FaCircle, FaSlash } from "react-icons/fa"; // Example shape icons

import "./Toolbar.scss";

type Tool = "pen" | "eraser" | "text" | "clear";
type Shape = "rectangle" | "circle" | "line";

interface ToolbarProps {
  tool: string;
  showPenFeatures: boolean;
  showEraserFeatures: boolean;
  undoStack: any[];
  redoStack: any[];
  handlePenClick: () => void;
  handleEraserClick: () => void;
  handleToolChange: (tool: Tool | Shape) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  toggleColorPicker: () => void;
  handleSizeClick: () => void;
  handleEraserSizeClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  showPenFeatures,
  showEraserFeatures,
  undoStack,
  redoStack,
  handlePenClick,
  handleEraserClick,
  handleToolChange,
  handleUndo,
  handleRedo,
  toggleColorPicker,
  handleSizeClick,
  handleEraserSizeClick,
}) => {
  return (
    <div className="toolbar">
      <div
        className={`undo-redo ${
          showPenFeatures ? "move-undo-redo-with-pen" : ""
        }${showEraserFeatures ? "move-undo-redo-with-eraser" : ""}`}
      >
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
      </div>
      <div
        className={`pen-container ${
          showPenFeatures ? "show-pen-features" : ""
        } ${showEraserFeatures ? "move-pen-with-eraser" : ""}`}
      >
        <button
          className={`tool-button ${tool === "pen" ? "selected" : ""}`}
          onClick={handlePenClick}
        >
          <FaPen />
        </button>
        <div
          className={`pen-features ${
            showPenFeatures ? "show-pen-features" : ""
          }`}
        >
          <button className="tool-button-feature" onClick={toggleColorPicker}>
            <FaDroplet />
          </button>
          <button className="tool-button-feature" onClick={handleSizeClick}>
            <FaSliders />
          </button>
        </div>
      </div>
      <div
        className={`eraser-container ${
          showEraserFeatures ? "show-eraser-features" : ""
        }`}
      >
        <button
          className={`tool-button ${tool === "eraser" ? "selected" : ""}`}
          onClick={handleEraserClick}
        >
          <FaEraser />
        </button>
        <div
          className={`eraser-features ${
            showEraserFeatures ? "show-eraser-features" : ""
          }`}
        >
          <button
            className="tool-button-feature"
            onClick={handleEraserSizeClick}
          >
            <FaSliders />
          </button>
        </div>
      </div>

      <button
        className={`tool-button ${tool === "text" ? "selected" : ""}`}
        onClick={() => handleToolChange("text")}
      >
        <FaTextHeight />
      </button>
      <button className="tool-button" onClick={() => handleToolChange("clear")}>
        <FaTrash />
      </button>

      <div className="shape-buttons">
        <button
          className={`tool-button ${tool === "rectangle" ? "selected" : ""}`}
          onClick={() => handleToolChange("rectangle")}
        >
          <FaSquare />
        </button>
        <button
          className="tool-button"
          onClick={() => handleToolChange("circle")}
        >
          <FaCircle />
        </button>
        <button
          className="tool-button"
          onClick={() => handleToolChange("line")}
        >
          <FaSlash />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
