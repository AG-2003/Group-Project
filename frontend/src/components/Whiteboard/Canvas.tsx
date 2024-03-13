import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text, StageProps, Rect } from "react-konva";
import Toolbar from "./Toolbar";
import "./Canvas.scss";
import { FaRegSquare, FaRegCircle, FaSlash, FaRegStar } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { BsArrowUpRight } from "react-icons/bs";

import { debounce } from "../../utils/Time";
import { SuiteProps } from "../../interfaces/SuiteProps";
import { SuiteData } from "../../interfaces/SuiteData";

import { doc, setDoc, collection, getDoc, DocumentData, DocumentReference, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, app as firebaseApp } from "../../firebase-config";

import * as Y from 'yjs'
import { FireProvider } from "y-fire";


type Tool = "pen" | "eraser" | "text" | "clear" | "pointer" | "shape";
type Shape =
  | "rectangle"
  | "circle"
  | "line"
  | "ellipse"
  | "triangle"
  | "star"
  | "arrow";

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

const Canvas: React.FC<SuiteProps> = ({ suiteId, suiteTitle, setSuiteTitle }: SuiteProps) => {
  const [tool, setTool] = useState<Tool>("pointer");
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
  const [showShapeMenu, setShowShapeMenu] = useState(false);



  //---------------Store the serialized data-----------------
  const [serializedLinesData, setSerializedLinesData] = useState('')
  const [serializedTextsData, setSerializedTextsData] = useState('')
  const [serializedRectanglesData, setSerializedRectanglesData] = useState('')

  /**
   * Collaboration purpose
   */

  const isSharePage = window.location.pathname.includes('/board/share')
  const [isLoading, setIsLoading] = useState(true)
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [currentSharedLineNumber, setCurrentSharedLineNumber] = useState<number>(0)

  useEffect(() => {
    if(isSharePage){
      const ydoc = new Y.Doc()

      //Update Lines
      const lineOrder = ydoc.getMap<number>('lineOrder')
      const linesMap = ydoc.getMap<LineType>('lines')
      //Update texts
      const textArray = ydoc.getArray<TextType>('texts')
      //Update Texts
      const rectanglesArray = ydoc.getArray<RectangleType>('rectangles')

      const yprovider = new FireProvider({ firebaseApp, ydoc, path: `sharedBoards/${suiteId}` })
      console.log(yprovider)

      const updateLines = () => {
        if(user?.email){
          lineOrder.forEach((value, key) => {
            const newLine = linesMap.get(key) as LineType
            console.log("From yjs useEffect")
            console.log(newLine)

            if (newLine.points.length !== 0){
              // console.log("It goes into the if statement")
              // console.log('Here are the lines before assigning to newLines', lines)
              // let newLines = [...lines]
              // console.log("NewLines before", newLines)
              // newLines[value]=newLine
              // console.log("NewLines after",newLines)
              // setLines(newLines)

              setLines(prevLines => {
                let newLines = [...prevLines];
                // Ensure newLines has a length at least as great as value + 1
                while (newLines.length <= value) {
                  // Push a default LineType object instead of undefined
                  newLines.push({
                    tool: "pen", // or any default tool
                    points: [], // or any default points
                    color: "#000000", // or any default color
                    strokeWidth: 5, // or any default strokeWidth
                  });
                }
                newLines[value] = newLine;
                return newLines;
              });

            }
          })
        }
      }

      const updateTexts = () => {

      }

      const updateRectangles = () => {

      }

      //Set up observers
      linesMap.observe(updateLines)
      textArray.observe(updateTexts)
      rectanglesArray.observe(updateRectangles)

      setYdoc(ydoc)

      return () => {
        linesMap.unobserve(updateLines)
        textArray.unobserve(updateTexts)
        rectanglesArray.unobserve(updateRectangles)
        lineOrder.clear()
        linesMap.clear()
        yprovider.destroy()
        ydoc.destroy()
      }
    }
  }, [])

  useEffect(() => {
    console.log('Lines state updated:', lines);
   }, [lines]);

    //---------------------------Function to render the saved whiteboard--------------
    useEffect(() => {
      const username = user?.email
      if (username && !isSharePage) {
        fetchDocumentFromFirestore(username);
      } else if(isSharePage){
        fetchSharedBoardFromFirestore(doc(collection(db, "sharedBoards"), suiteId))
      }
    }, []);

    const fetchDocumentFromFirestore = async (username: string) => {
      try {
        if (username) {
          const userDocRef = doc(collection(db, "users"), username);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const boardsArray: SuiteData[] = docSnapshot.data().boards || [];
            const board = boardsArray.find(board => board.id === suiteId);
            if (board && board.content) {
              const boardContent = JSON.parse(board.content)
              setLines(JSON.parse(boardContent[0]))
              setTexts(JSON.parse(boardContent[1]))
              setRectangles(JSON.parse(boardContent[2]))
              setSuiteTitle(board.title)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }

      setIsLoading(false)
    };

    const fetchSharedBoardFromFirestore = async (sharedBoardRef: DocumentReference<DocumentData, DocumentData>) => {
      try {
        if (isSharePage) {
          const docSnapshot = await getDoc(sharedBoardRef);
          if (docSnapshot.exists()) {
            const board = docSnapshot.data() as SuiteData;
            if (board && board.boardContent) {
              const boardContent = JSON.parse(board.boardContent)
              setLines(JSON.parse(boardContent[0]))
              setTexts(JSON.parse(boardContent[1]))
              setRectangles(JSON.parse(boardContent[2]))
              setSuiteTitle(board.title)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }

      setIsLoading(false)
    };
    //____________________________________________________________


  useEffect(() => {
    /*
      *lines-> to store what is written by the pen in the toolbar
      *texts-> text from toolbar
      *rectangles-> a part of the 'shapes' on the toolbar
    */
    if(!isLoading)
      {
        setSerializedLinesData(JSON.stringify(lines))
        setSerializedTextsData(JSON.stringify(texts))
        setSerializedRectanglesData(JSON.stringify(rectangles))
      }

  }, [lines, texts, rectangles]); // This effect runs whenever user changes the board
  //____________________________________________________________



  //---------------Function to save the document to the database----------------
  const [user] = useAuthState(auth)

  useEffect(() => {
    const username = user?.email
    if (username && !isLoading) {
      const dataArray = [serializedLinesData, serializedTextsData, serializedRectanglesData]

      if(!isSharePage) {
        debouncedSaveBoardToFirestore(
          username,
          suiteId,
          suiteTitle,
          dataArray
        )
      } else if (isSharePage) {
        saveSharedBoardToFirestore(dataArray as [string, string, string])
      }
    }
  }, [serializedLinesData, serializedTextsData, serializedRectanglesData, suiteTitle])

  const saveBoardToFirestore = async (
    username: string,
    boardId: string,
    boardTitle: string,
    data: [string, string, string]
  ) => {
    try {
      const userDocRef = doc(collection(db, "users"), username);
      // Get the current document to see if there are existing documents
      const docSnapshot = await getDoc(userDocRef);
      let boardsArray: SuiteData[] = [];

      if (docSnapshot.exists()) {
        // Get the existing documents array or initialize it if it doesn't exist
        boardsArray = docSnapshot.data().boards || [];
      }

      const now = new Date().toISOString(); // Get current time as ISO string

      // Check if the document with the given ID already exists
      const existingBoardIndex = boardsArray.findIndex(
        (board: SuiteData) => board.id === boardId
      );



      if (existingBoardIndex !== -1) {
        // Update the existing document's title and content
        boardsArray[existingBoardIndex] = {
          ...boardsArray[existingBoardIndex],
          title: boardTitle,
          lastEdited: now,
          content: JSON.stringify(data)
        };
      } else {
        // Add a new document with a unique ID
        boardsArray.push({
          id: boardId,
          title: boardTitle,
          lastEdited: now,
          content: JSON.stringify(data),
          type: 'board',
          isTrash: false,
          isShared: false
        });
      }

      // Update the user's document with the new or updated documents array
      await setDoc(
        userDocRef,
        {
          boards: boardsArray,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving document:", error);

    }
  };

  /**
   * For collaborative storage
   */

  const saveSharedBoardToFirestore = async (
    data: [string, string, string]
  ): Promise<void> => {
    try {
      if (isSharePage) {
        // Retrieve the existing document
        const sharedBoardRef = doc(db, "sharedBoards", suiteId);
        const boardSnapshot = await getDoc(sharedBoardRef);
        let sharedBoard: SuiteData;

        if (boardSnapshot.exists() && user?.email) {
          // If the document exists, update only the comments and latestLastEdited fields
          sharedBoard = boardSnapshot.data() as SuiteData;
          sharedBoard.boardContent = JSON.stringify(data);
          sharedBoard.lastEdited = new Date().toISOString();
          sharedBoard.title=suiteTitle

          if (sharedBoard.user && !sharedBoard.user.includes(user?.email)) {
            sharedBoard.user.push(user?.email);
          } else if (!sharedBoard.user) {
            sharedBoard.user = [user?.email];
          }
        } else {
          // If the document does not exist, construct a new SuiteData object
          sharedBoard = {
            id: suiteId,
            title: suiteTitle,
            lastEdited: new Date().toISOString(),
            type: 'board',
            boardContent: JSON.stringify(data),
            isTrash: false,
            isShared: isSharePage
          };
        }

        // Save the document with the updated fields
        await setDoc(sharedBoardRef, sharedBoard, { merge: true });
        console.log("Shared document saved successfully");
      }
    } catch (error) {
      console.error("Error saving shared document:", error);
    }
  };

  const debouncedSaveBoardToFirestore = debounce(
    saveBoardToFirestore,
    2000 // Delay in milliseconds
  );
  //____________________________________________________________



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

  const toggleShapeMenu = () => {
    console.log("Toggling shape menu");
    setShowShapeMenu((prev) => {
      console.log("Previous state: ", prev);
      return !prev;
    });
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

        if(ydoc && isSharePage && user?.email){
          const lineOrder = ydoc.getMap<number>('lineOrder')
          const linesMap = ydoc.getMap<LineType>('lines')

          lineOrder.set(user?.email, lines.length)
          setCurrentSharedLineNumber(lines.length)
          linesMap.set(user?.email, {
            tool,
            points: [pos.x, pos.y],
            color: penColor,
            strokeWidth: size,
          })
        }
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

        if(ydoc && isSharePage && user?.email){
          const lineOrder = ydoc.getMap<number>('lineOrder')
          const linesMap = ydoc.getMap<LineType>('lines')

          lineOrder.set(user?.email, lines.length)
          setCurrentSharedLineNumber(lines.length)
          linesMap.set(user?.email, {
            tool,
            points: [pos.x, pos.y],
            color: "rgba(0,0,0,1)",
            strokeWidth: size,
          })
        }
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
            width: 0, // Keep these as zero initially
            height: 0,
            fill: penColor,
          });
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

        if(ydoc && user?.email && isSharePage){
          const linesMap = ydoc.getMap<LineType>('lines')

          linesMap.set(user?.email, {
            tool,
            points: newPoints,
            color: "rgba(0,0,0,1)",
            strokeWidth: size,
          })
        }
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

      if(ydoc && user?.email && isSharePage){
        const linesMap = ydoc.getMap<LineType>('lines')

        linesMap.set(user?.email, {
          tool,
          points: newPoints,
          color: "rgba(0,0,0,1)",
          strokeWidth: size,
        })
      }
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
    if (selectedTool === "pointer") {
      setTool("pointer");
    }
    if (selectedTool === "clear") {
      setLines([]);
      setTexts([]);
      setRectangles([]);
      setCurrentRectangle(null);

      if(ydoc && isSharePage && user?.email){

      }
    } else {
      // If the selected tool is a shape, we update the selectedShape state.
      if (selectedTool !== "shape") {
        setShowShapeMenu(false);
      }
      if (isShape(selectedTool)) {
        setSelectedShape(selectedTool);
        setTool("pointer"); // 'none' indicates no drawing tool is selected.
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
              draggable={tool === "pointer"}
            />
          ))}
          {texts.map((textItem, i) => (
            <Text
              key={i}
              x={textItem.x}
              y={textItem.y}
              text={textItem.text}
              fontSize={20}
              draggable={tool === "pointer"}
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
              draggable={tool === "pointer"}
            />
          ))}
          {currentRectangle && (
            <Rect
              x={currentRectangle.x}
              y={currentRectangle.y}
              width={currentRectangle.width}
              height={currentRectangle.height}
              fill={currentRectangle.fill}
              draggable={tool === "pointer"}
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
        toggleShapeMenu={toggleShapeMenu}
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
      {showShapeMenu && (
        <div className="shape-menu">
          <button
            className="tool-button"
            onClick={() => handleToolChange("rectangle")}
          >
            <FaRegSquare />
          </button>
          <button
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
          </button>
          <button
            className="tool-button"
            onClick={() => handleToolChange("triangle")}
          >
            <FiTriangle />
          </button>
          <button
            className="tool-button"
            onClick={() => handleToolChange("star")}
          >
            <FaRegStar />
          </button>
          <button
            className="tool-button"
            onClick={() => handleToolChange("arrow")}
          >
            <BsArrowUpRight />
          </button>
        </div>
      )}
      {/* ... other components ... */}
    </div>
  );
};

export default Canvas;