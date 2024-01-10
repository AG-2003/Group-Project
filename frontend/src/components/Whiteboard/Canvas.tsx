import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text, StageProps, Rect } from "react-konva";
import Toolbar from "./Toolbar";
import "./Canvas.scss";

type Tool = "pen" | "eraser" | "text" | "clear" | "none";
type Shape = "rectangle" | "circle" | "line";

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

interface RectangleType {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
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

function isShape(tool: string): tool is Shape {
  return ["rectangle", "circle", "line"].includes(tool);
}

const Canvas: React.FC = () => {
  const [tool, setTool] = useState<Tool>("pen");
  const [penColor, setPenColor] = useState<string>("#000000"); // Default pen color
  const [size, setSize] = useState<number>(5); // Default stroke size
  const [lines, setLines] = useState<LineType[]>([]);
  const stageRef = useRef<any>(null); // Ref for the Konva Stage
  const [texts, setTexts] = useState<TextType[]>([]);
  const isDrawing = useRef(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [undoStack, setUndoStack] = useState<LineType[][]>([]);
  const [redoStack, setRedoStack] = useState<LineType[][]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [currentRectangle, setCurrentRectangle] =
    useState<RectangleType | null>(null);
  const [rectangles, setRectangles] = useState<RectangleType[]>([]);

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

  const validateAndUpdateSize = (size: number) => {
    const newSize = Math.max(1, Math.min(size, 40)); // Assuming max size is 20
    setSize(newSize);
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
            strokeWidth: size,
          },
        ]);
      }
      if (tool === "eraser") {
        setLines([
          ...lines,
          {
            tool,
            points: [pos.x, pos.y],
            color: "rgba(0,0,0,1)", // Eraser color, set alpha to 1 for full erasing
            strokeWidth: size,
          },
        ]);
      }

      if (tool === "text") {
        const text = prompt("Enter the text:");
        if (text) {
          setTexts([...texts, { tool, x: pos.x, y: pos.y, text }]);
        }
      }
      if (selectedShape === "rectangle") {
        const stage = e.target.getStage();
        const point = stage?.getPointerPosition();

        if (point) {
          setCurrentRectangle({
            x: point.x,
            y: point.y,
            width: 0,
            height: 0,
            fill: penColor, // Use the current pen color for the rectangle fill
          });
          console.log("Rectangle drawing started", currentRectangle);
        }
      }
    }
  };

  const handleMouseMove: StageProps["onMouseMove"] = (e) => {
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();

    if (!point) {
      return;
    }

    // Handle drawing for pen tool
    if (tool === "pen" && lines.length > 0) {
      let lastLine = lines[lines.length - 1];
      if (lastLine) {
        const newPoints = lastLine.points.concat([point.x, point.y]);
        setLines(
          lines.map((line, index) =>
            index === lines.length - 1 ? { ...line, points: newPoints } : line
          )
        );
      }
    }

    if (tool === "eraser" && lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      const newPoints = lastLine.points.concat([point.x, point.y]);
      setLines(
        lines.map((line, index) =>
          index === lines.length - 1 ? { ...line, points: newPoints } : line
        )
      );
    }

    // Handle drawing for shapes
    if (selectedShape === "rectangle" && currentRectangle) {
      const newWidth = Math.abs(point.x - currentRectangle.x);
      const newHeight = Math.abs(point.y - currentRectangle.y);
      const newX = point.x < currentRectangle.x ? point.x : currentRectangle.x;
      const newY = point.y < currentRectangle.y ? point.y : currentRectangle.y;

      setCurrentRectangle({
        ...currentRectangle,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }

    // Add similar conditions for other shapes if needed
    // ...
  };

  const handleMouseUp: StageProps["onMouseUp"] = () => {
    if (selectedShape === "rectangle" && currentRectangle) {
      if (currentRectangle.width !== 0 && currentRectangle.height !== 0) {
        setRectangles([...rectangles, currentRectangle]);
        console.log("Rectangle drawing finished", currentRectangle);
      }
      setCurrentRectangle(null);
    }
    isDrawing.current = false;
  };

  const handleToolChange = (selectedTool: Tool | Shape) => {
    if (selectedTool === "clear") {
      setLines([]);
      setTexts([]);
      setRectangles([]);
      setCurrentRectangle(null);
    } else {
      // If the selected tool is a shape, we update the selectedShape state.
      if (isShape(selectedTool)) {
        setSelectedShape(selectedTool);
        setTool("none"); // 'none' indicates no drawing tool is selected.
      } else {
        // If the selected tool is not a shape, we update the tool state and clear the shape.
        setTool(selectedTool as Tool);
        setSelectedShape(null); // Clear any selected shape.
      }
    }
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
    }

    // Add the event listener to the document
    document.addEventListener("mousedown", handleOutsideClick);

    // Remove the event listener on cleanup
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showColorPicker, showSizeSlider]);

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
    <div className="canvas-container">
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
          {rectangles.map((rect, i) => (
            <Rect
              key={i}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              draggable
            />
          ))}
          {currentRectangle && (
            <Rect
              x={currentRectangle.x}
              y={currentRectangle.y}
              width={currentRectangle.width}
              height={currentRectangle.height}
              fill={currentRectangle.fill}
            />
          )}
        </Layer>
      </Stage>
      <Toolbar
        tool={tool}
        undoStack={undoStack}
        redoStack={redoStack}
        handleToolChange={handleToolChange}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        toggleColorPicker={toggleColorPicker}
        handleSizeClick={handleSizeClick}
      />
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
            max="40"
            value={size}
            onChange={(e) => validateAndUpdateSize(parseInt(e.target.value))}
            className="stroke-size-slider"
          />
          <input
            type="number"
            value={size}
            onChange={(e) => validateAndUpdateSize(parseInt(e.target.value))}
            className="stroke-size-input"
          />
        </div>
      )}
      {/* ... other components ... */}
    </div>
  );
};

export default Canvas;
