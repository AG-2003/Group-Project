import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text, StageProps } from "react-konva";
import {
  FaPen,
  FaEraser,
  FaTextHeight,
  FaTrash,
  FaUndo,
  FaRedo,
} from "react-icons/fa"; // Import necessary icons
import { FaDroplet, FaSliders } from "react-icons/fa6";
import "./Canvas.scss";

type Tool = "pen" | "eraser" | "text" | "clear";

interface LineType {
  tool: Tool;
  points: number[];
  color: string; // Add color attribute for lines
  strokeWidth: number; // Add stroke width to the line type
}

interface TextType {
  tool: Tool;
  x: number;
  y: number;
  text: string;
}

const colors = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#b7b7b7",
  "#cccccc",
  "#d9d9d9",
  "#efefef",
  "#f3f3f3",
  "#ffffff",

  "#980000",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#4a86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",

  "#e6b8af",
  "#f4cccc",
  "#fce5cd",
  "#fff2cc",
  "#d9ead3",
  "#d0e0e3",
  "#c9daf8",
  "#cfe2f3",
  "#d9d2e9",
  "#ead1dc",

  "#dd7e6b",
  "#ea9999",
  "#f9cb9c",
  "#ffe599",
  "#b6d7a8",
  "#a2c4c9",
  "#a4c2f4",
  "#9fc5e8",
  "#b4a7d6",
  "#d5a6bd",

  "#cc4125",
  "#e06666",
  "#f7b558",
  "#ffd966",
  "#93c47d",
  "#76a5af",
  "#6d9eeb",
  "#6fa8dc",
  "#8e7cc3",
  "#c27ba0",

  "#a61c00",
  "#cc0000",
  "#e69138",
  "#f1c232",
  "#6aa84f",
  "#45818e",
  "#3c78d8",
  "#3d85c6",
  "#674ea7",
  "#a64d79",

  "#85200c",
  "#990000",
  "#b45f06",
  "#bf9000",
  "#38761d",
  "#134f5c",
  "#1155cc",
  "#0b5394",
  "#351c75",
  "#741b47",

  "#5b0f00",
  "#660000",
  "#783f04",
  "#7f6000",
  "#274e13",
  "#0c343d",
  "#1c4587",
  "#073763",
  "#20124d",
  "#4c1130",
];

const Canvas: React.FC = () => {
  const [tool, setTool] = useState<Tool>("pen");
  const [penColor, setPenColor] = useState<string>("#000000"); // Default pen color
  const [strokeSize, setStrokeSize] = useState<number>(5); // Default stroke size
  const [lines, setLines] = useState<LineType[]>([]);
  const [eraserSize, setEraserSize] = useState<number>(20); // Default eraser size
  const stageRef = useRef<any>(null); // Ref for the Konva Stage
  const [texts, setTexts] = useState<TextType[]>([]);
  const isDrawing = useRef(false);
  const [showPenFeatures, setShowPenFeatures] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [showEraserFeatures, setShowEraserFeatures] = useState(false);
  const [showEraserSizeSlider, setShowEraserSizeSlider] = useState(false);
  const [undoStack, setUndoStack] = useState<LineType[][]>([]);
  const [redoStack, setRedoStack] = useState<LineType[][]>([]);

  const handlePenClick = () => {
    setTool("pen");
    const isPenFeaturesVisible = !showPenFeatures;
    setShowPenFeatures(isPenFeaturesVisible);
    // Add this line to toggle the move-with-pen class
    setShowEraserFeatures(false);
  };

  const toggleColorPicker = () => {
    const newShowColorPicker = !showColorPicker;
    setShowColorPicker(newShowColorPicker);
    if (newShowColorPicker) {
      setActiveElement(document.querySelector(".color-grid"));
    } else {
      setActiveElement(null);
    }
    if (showSizeSlider) setShowSizeSlider(false);
  };

  const handleSizeClick = () => {
    const newShowSizeSlider = !showSizeSlider;
    setShowSizeSlider(newShowSizeSlider);
    if (newShowSizeSlider) {
      setActiveElement(document.querySelector(".containerSlider"));
    } else {
      setActiveElement(null);
    }
    if (showColorPicker) setShowColorPicker(false);
  };

  const handleEraserClick = () => {
    setTool("eraser");
    setShowEraserFeatures(!showEraserFeatures);
    setShowPenFeatures(false);
    setShowEraserSizeSlider(false); // Hide the eraser size slider when the eraser is clicked
  };

  const handleEraserSizeClick = () => {
    const newShowEraserSizeSlider = !showEraserSizeSlider;
    setShowEraserSizeSlider(newShowEraserSizeSlider);
    if (newShowEraserSizeSlider) {
      setActiveElement(document.querySelector(".eraserSlider"));
    } else {
      setActiveElement(null);
    }
    // Hide other sliders or color pickers
    if (showSizeSlider) setShowSizeSlider(false);
    if (showColorPicker) setShowColorPicker(false);
  };

  const validateAndUpdateStrokeSize = (size: number) => {
    const newSize = Math.max(1, Math.min(size, 20)); // Assuming max size is 20
    setStrokeSize(newSize);
  };

  const validateAndUpdateEraserSize = (size: number) => {
    const newSize = Math.max(1, Math.min(size, 40)); // Assuming max size is 40
    setEraserSize(newSize);
  };

  const handleMouseDown: StageProps["onMouseDown"] = (e) => {
    if (e.target !== e.target.getStage() && tool === "text") {
      return;
    }

    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();

    if (pos) {
      if (tool === "pen") {
        setUndoStack([...undoStack, [...lines]]);
        setRedoStack([]);
        setLines([
          ...lines,
          {
            tool,
            points: [pos.x, pos.y],
            color: penColor,
            strokeWidth: strokeSize,
          },
        ]);
      } else if (tool === "eraser") {
        setUndoStack([...undoStack, [...lines]]);
        setRedoStack([]);
        setLines([
          ...lines,
          {
            tool,
            points: [pos.x, pos.y],
            color: penColor,
            strokeWidth: eraserSize,
          },
        ]);
      } else if (tool === "text") {
        const text = prompt("Enter the text:");
        if (text) {
          setTexts([...texts, { tool, x: pos.x, y: pos.y, text }]);
        }
      }
    }
  };

  const handleMouseMove: StageProps["onMouseMove"] = (e) => {
    if (!isDrawing.current || tool === "text") {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (point) {
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp: StageProps["onMouseUp"] = () => {
    isDrawing.current = false;
  };

  const handleToolChange = (selectedTool: Tool) => {
    if (selectedTool === "clear") {
      // Clear the board logic
    }

    setTool(selectedTool);
    setShowPenFeatures(false);
    setShowEraserFeatures(false);
    // Close other feature panels if needed
  };

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      // Cast the target of the click to an Element
      const target = event.target as Element;

      if (
        showColorPicker &&
        !document.querySelector(".color-grid")?.contains(target)
      ) {
        setShowColorPicker(false);
      }
      if (
        showSizeSlider &&
        !document.querySelector(".containerSlider")?.contains(target)
      ) {
        setShowSizeSlider(false);
      }
      if (
        showEraserSizeSlider &&
        !document.querySelector(".eraserSlider")?.contains(target)
      ) {
        setShowEraserSizeSlider(false);
      }
    }

    // Add the event listener to the document
    document.addEventListener("mousedown", handleOutsideClick);

    // Remove the event listener on cleanup
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showColorPicker, showSizeSlider, showEraserSizeSlider]); // This effect should run when activeElement changes

  const clearBoard = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the board?"
    );
    if (confirmClear) {
      setLines([]);
      setTexts([]);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const previousLines = newUndoStack.pop();
      setRedoStack([...redoStack, [...lines]]);
      setLines(previousLines || []);
      setUndoStack(newUndoStack);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextLines = newRedoStack.pop();
      setUndoStack([...undoStack, [...lines]]);
      setLines(nextLines || []);
      setRedoStack(newRedoStack);
    }
  };

  return (
    <div className="canvas-container" onDoubleClick={clearBoard}>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
          {texts.map((textItem, i) => (
            <Text
              key={i}
              x={textItem.x}
              y={textItem.y}
              text={textItem.text}
              fontSize={20}
              draggable
            />
          ))}
        </Layer>
      </Stage>
      <div className="toolbar">
        <div
          className={`undo-redo ${
            showPenFeatures ? "move-undo-redo-with-pen" : ""}${showEraserFeatures ? "move-undo-redo-with-eraser" : ""}`}
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
          } ${showEraserFeatures ? "move-pen-with-tools" : ""}`}
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
            <button onClick={toggleColorPicker}>
              <FaDroplet />
            </button>
            <button onClick={handleSizeClick}>
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
            <button onClick={handleEraserSizeClick}>
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
        <button
          className="tool-button"
          onClick={() => handleToolChange("clear")}
        >
          <FaTrash />
        </button>
      </div>

      {showColorPicker && (
        <div className={`color-grid ${showColorPicker ? "active" : ""}`}>
          {colors.map((color) => (
            <div
              key={color}
              className={`color-block ${penColor === color ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => setPenColor(color)}
            />
          ))}
        </div>
      )}

      {showSizeSlider && (
        <div className="containerSlider">
          <input
            type="range"
            min="1"
            max="20"
            value={strokeSize}
            onChange={(e) =>
              validateAndUpdateStrokeSize(parseInt(e.target.value))
            }
            className="stroke-size-slider"
          />
          <input
            type="number"
            value={strokeSize}
            onChange={(e) =>
              validateAndUpdateStrokeSize(parseInt(e.target.value))
            }
            className="stroke-size-input"
          />
        </div>
      )}
      {showEraserSizeSlider && (
        <div className="eraserSlider">
          <input
            type="range"
            min="1"
            max="40"
            value={eraserSize}
            onChange={(e) =>
              validateAndUpdateEraserSize(parseInt(e.target.value))
            }
            className="eraser-size-slider"
          />
          <input
            type="number"
            value={eraserSize}
            onChange={(e) =>
              validateAndUpdateEraserSize(parseInt(e.target.value))
            }
            className="eraser-size-input"
          />
        </div>
      )}
      {/* ... other components ... */}
    </div>
  );
};

export default Canvas;
