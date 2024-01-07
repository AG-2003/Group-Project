import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Text, StageProps } from "react-konva";
import "./Canvas.scss";

type Tool = "pen" | "eraser" | "text" | "clear";

interface LineType {
  tool: Tool;
  points: number[];
}

interface TextType {
  tool: Tool;
  x: number;
  y: number;
  text: string;
}

const Canvas: React.FC = () => {
  const [tool, setTool] = useState<Tool>("pen");
  const [lines, setLines] = useState<LineType[]>([]);
  const [texts, setTexts] = useState<TextType[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown: StageProps["onMouseDown"] = (e) => {
    // Prevent text tool action if clicking on an existing text
    if (e.target !== e.target.getStage() && tool === "text") {
      return;
    }

    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();

    if (pos) {
      if (tool === "pen" || tool === "eraser") {
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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
      clearBoard();
    } else {
      setTool(selectedTool);
    }
  };

  const clearBoard = () => {
    // Confirmation before clearing the board
    const confirmClear = window.confirm(
      "Are you sure you want to clear the board?"
    );
    if (confirmClear) {
      setLines([]);
      setTexts([]);
    }
  };

  return (
    <div className="canvas-container">
      <Stage
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
              stroke="#df4b26"
              strokeWidth={5}
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
      <select
        value={tool}
        onChange={(e) => handleToolChange(e.target.value as Tool)}
        className="tool-selector"
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
        <option value="text">Text</option>
        <option value="clear">Clear Board</option>{" "}
      </select>
    </div>
  );
};

export default Canvas;
