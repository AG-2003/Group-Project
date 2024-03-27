import React from "react";
import {
  FaPen,
  FaEraser,
  FaTextHeight,
  FaTrash,
  FaUndo,
  FaRedo,
  FaMousePointer,
  FaShapes,
} from "react-icons/fa";
import { FaDroplet, FaSliders } from "react-icons/fa6";

import "./Toolbar.scss";
import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";

type Tool = "pen" | "eraser" | "text" | "clear" | "pointer" | "shape";
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
  toggleShapeMenu: () => void;
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
  toggleShapeMenu,
}) => {
  return (
    <div className="containerBoard">
      <ButtonGroup className="toolbarBoard">
        <Tooltip label="Pointer" hasArrow>
          <IconButton
            className={`tool-button ${tool === "pointer" ? "selected" : ""}`}
            aria-label="Pointer"
            icon={<FaMousePointer />}
            onClick={() => handleToolChange("pointer")}
          />
        </Tooltip>
        <Tooltip label="Undo" hasArrow>
          <IconButton
            className="tool-button"
            aria-label="Undo"
            disabled={undoStack.length === 0}
            icon={<FaUndo />}
            onClick={handleUndo}
          />
        </Tooltip>
        <Tooltip label="Redo" hasArrow>
          <IconButton
            className="tool-button"
            aria-label="Redo"
            disabled={redoStack.length === 0}
            icon={<FaRedo />}
            onClick={handleRedo}
          />
        </Tooltip>
        <Tooltip label="Pen" hasArrow>
          <IconButton
            className={`tool-button ${tool === "pen" ? "selected" : ""}`}
            aria-label="Pen"
            icon={<FaPen />}
            onClick={() => handleToolChange("pen")}
          />
        </Tooltip>
        <Tooltip label="Eraser" hasArrow>
          <IconButton
            className={`tool-button ${tool === "eraser" ? "selected" : ""}`}
            aria-label="Eraser"
            icon={<FaEraser />}
            onClick={() => handleToolChange("eraser")}
          />
        </Tooltip>
        <Tooltip label="Text" hasArrow>
          <IconButton
            className={`tool-button ${tool === "text" ? "selected" : ""}`}
            aria-label="Text"
            icon={<FaTextHeight />}
            onClick={() => handleToolChange("text")}
          />
        </Tooltip>
        <Tooltip label="Shapes" hasArrow>
          <IconButton
            className={`tool-button ${tool === "shape" ? "selected" : ""}`}
            aria-label="Shapes"
            icon={<FaShapes />}
            onClick={toggleShapeMenu}
          />
        </Tooltip>
        <Tooltip label="Colour" hasArrow>
          <IconButton
            className="tool-button"
            aria-label="Colour"
            icon={<FaDroplet />}
            onClick={toggleColorPicker}
          />
        </Tooltip>
        <Tooltip label="Size" hasArrow>
          <IconButton
            className="tool-button"
            aria-label="Size"
            icon={<FaSliders />}
            onClick={handleSizeClick}
          />
        </Tooltip>
        <Tooltip label="Clear" hasArrow>
          <IconButton
            className="tool-button"
            aria-label="Size"
            icon={<FaTrash />}
            onClick={() => handleToolChange("clear")}
          />
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default Toolbar;
