import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Text, StageProps, Circle } from "react-konva";
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
  "#e06666",
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
  const [showEraserCue, setShowEraserCue] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [texts, setTexts] = useState<TextType[]>([]);
  const isDrawing = useRef(false);

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
        // Include the eraser size in the line data
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
      if (point) {
        setCursorPosition(point); // Update cursor position
        if (tool === "eraser") {
          setShowEraserCue(true); // Show eraser cue if eraser tool is selected
        }
      }
    }
  };

  const handleMouseUp: StageProps["onMouseUp"] = () => {
    isDrawing.current = false;
  };

  const handleToolChange = (selectedTool: Tool) => {
    if (selectedTool === "clear") {
      clearBoard();
    } else {
      setTool(selectedTool);
      setShowEraserCue(selectedTool === "eraser");
    }
  };

  // // Show the eraser cue when the eraser tool is active and the mouse is over the canvas
  // const handleMouseEnter: StageProps["onMouseEnter"] = () => {
  //   if (tool === "eraser") {
  //     setShowEraserCue(true);
  //   }
  // };

  // Hide the eraser cue when the mouse leaves the canvas
  const handleMouseLeave: StageProps["onMouseLeave"] = () => {
    setShowEraserCue(false);
  };

  const clearBoard = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the board?"
    );
    if (confirmClear) {
      setLines([]);
      setTexts([]);
    }
  };

  return (
    <div className="canvas-container" onDoubleClick={clearBoard}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
          {showEraserCue && (
            <Circle
              x={cursorPosition.x}
              y={cursorPosition.y}
              radius={eraserSize / 2}
              stroke="#000000" // Border color for the eraser cue
              strokeWidth={1}
              shadowColor="black"
              shadowBlur={5}
              shadowOffsetX={2}
              shadowOffsetY={2}
              shadowOpacity={0.5}
            />
          )}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={(e) => handleToolChange(e.target.value as Tool)}
        className="tool-selector"
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
        <option value="text">Text</option>
        <option value="clear">Clear Board</option>
      </select>
      {tool === "pen" && (
        <>
          <div className="color-grid">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-block ${
                  penColor === color ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setPenColor(color)}
              />
            ))}
          </div>
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
        </>
      )}
      {tool === "eraser" && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Canvas;
