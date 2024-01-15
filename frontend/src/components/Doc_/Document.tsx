import { useRef, useState, useMemo, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";

import ReactQuill from "react-quill";
import ToolBar from "./Toolbar";
import "react-quill/dist/quill.snow.css";
import "./Document.scss";

function debounce(
  func: (...args: any[]) => void,
  wait: number
): (...args: any[]) => void {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: any[]): void {
    const later = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

interface CommentType {
  id: number;
  text: string;
  rangeIndex: number;
  rangeLength: number;
}

// Define an interface for the document objects
interface DocumentData {
  id: string; // Unique identifier for each document
  title: string;
  content: string;
}

//Define a Props interface
interface Props {
  documentId: string;
  documentTitle: string;
}

const Document: React.FC<Props> = ({ documentTitle, documentId }: Props) => {
  const [value, setValue] = useState<string>("");
  const quillRef = useRef<ReactQuill>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isSpellCheckEnabled, setSpellCheckEnabled] = useState<boolean>(true);

  //---------------Function to save the document to the database----------------
  const [user] = useAuthState(auth);

  // Use useEffect to call saveDocumentToFirestore whenever the value changes
  useEffect(() => {
    const username = user?.email; // Replace with the actual username
    if (username) {
      debouncedSaveDocumentToFirestore(
        username,
        documentId,
        documentTitle,
        value
      );
    }
  }, [value, documentTitle]); // Only re-run the effect if 'value' changes

  const saveDocumentToFirestore = async (
    username: string,
    documentId: string,
    documentTitle: string,
    text: string
  ) => {
    try {
      const userDocRef = doc(collection(db, "users"), username);
      // Get the current document to see if there are existing documents
      const docSnapshot = await getDoc(userDocRef);
      let documentsArray: DocumentData[] = [];

      if (docSnapshot.exists()) {
        // Get the existing documents array or initialize it if it doesn't exist
        documentsArray = docSnapshot.data().documents || [];
      }

      // Check if the document with the given ID already exists
      const existingDocIndex = documentsArray.findIndex(
        (doc: DocumentData) => doc.id === documentId
      );

      if (existingDocIndex !== -1) {
        // Update the existing document's title and content
        documentsArray[existingDocIndex] = {
          id: documentId,
          title: documentTitle,
          content: text,
        };
      } else {
        // Add a new document with a unique ID
        documentsArray.push({
          id: documentId,
          title: documentTitle,
          content: text,
        });
      }

      // Update the user's document with the new or updated documents array
      await setDoc(
        userDocRef,
        {
          documents: documentsArray,
        },
        { merge: true }
      );
      console.log("Document saved successfully");
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const debouncedSaveDocumentToFirestore = debounce(
    saveDocumentToFirestore,
    5000 // Delay in milliseconds
  );
  //____________________________________________________________

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = debounce((searchTerm: string) => {
    if (searchTerm && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const text = editor.getText();
      const startIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());

      if (startIndex !== -1) {
        editor.setSelection(startIndex, searchTerm.length); // Highlight the found text
      } else {
        editor.setSelection(0, 0); // Reset selection if not found
      }
    }
  }, 700);

  const handleUndo = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor() as any;
      editor.history.undo();
    }
  };

  const handleRedo = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor() as any;
      editor.history.redo();
    }
  };

  const handleToggleSpellCheck = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElem = editor.root; // This is the editor element
      editorElem.spellcheck = !isSpellCheckEnabled; // Toggle the spellcheck attribute
      setSpellCheckEnabled(!isSpellCheckEnabled); // Update state
    }
  };

  const handleTextTypeChange = (format: string, level?: number) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (format === "normal") {
        editor.format("header", false); // Removes any header formatting
      } else {
        editor.format(format, level || false); // Apply header level or blockquote
      }
    }
  };

  const handleFontChange = (font: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("font", font.toLowerCase().replace(/\s/g, "-"));
    }
  };

  const handleFontSizeSelect = (size: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("size", size);
    }
  };

  const handleBoldClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("bold", !editor.getFormat().bold);
    }
  };

  const handleItalicClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("italic", !editor.getFormat().italic);
    }
  };

  const handleUnderlineClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("underline", !editor.getFormat().underline);
    }
  };

  const handleStrikeClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("strike", !editor.getFormat().strike);
    }
  };

  const handleColorSelect = (color: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("color", color);
    }
  };

  const handleHighlightSelect = (color: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("background", color);
    }
  };

  const handleLinkClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        const url = prompt("Enter the URL");
        if (url) {
          editor.format("link", url);
        }
      }
    }
  };

  const handleAddComment = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range && range.length > 0) {
        const commentText = prompt("Enter your comment:");
        if (commentText) {
          const comment = {
            id: Date.now(),
            text: commentText,
            rangeIndex: range.index,
            rangeLength: range.length,
          };
          setComments((prevComments) => [...prevComments, comment]);

          // Apply custom formatting for commented text
          editor.formatText(range.index, range.length, {
            "comment-id": comment.id,
          });
          editor.formatText(
            range.index,
            range.length,
            "ql-commented-text",
            true
          );
        }
      } else {
        alert("Please select text to comment on.");
      }
    }
  };

  const handleRemoveComment = (commentId: number) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // Find the comment based on commentId
      const comment = comments.find((c) => c.id === commentId);
      if (comment) {
        // Remove the custom formatting for commented text
        editor.formatText(
          comment.rangeIndex,
          comment.rangeLength,
          "ql-commented-text",
          false
        );
      }

      // Remove the comment from the state
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      if (input.files) {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (quillRef.current) {
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, "image", reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };
  };

  const handleTextAlignmentChange = (alignment: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("align", alignment);
    }
  };

  const handleChecklistClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        const format = editor.getFormat(range.index, range.length);
        editor.format("list", format.list === "checked" ? null : "checked");
      }
    }
  };

  const handleUnorderedListClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const format = editor.getFormat();
      editor.format("list", format.list === "bullet" ? null : "bullet");
    }
  };

  const handleOrderedListClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const format = editor.getFormat();
      editor.format("list", format.list === "ordered" ? null : "ordered");
    }
  };

  const handleIndentClick = (direction: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        const currentIndent = editor.getFormat(range).indent || 0;
        const newIndent =
          direction === "indent" ? currentIndent + 1 : currentIndent - 1;
        editor.format("indent", newIndent > 0 ? newIndent : false);
      }
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: false, // Keep this false if you are using a custom toolbar
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  return (
    <div>
      <ToolBar
        onSearch={handleSearch}
        isSearchVisible={isSearchVisible}
        toggleSearchVisibility={toggleSearchVisibility}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSpellCheckEnabled={isSpellCheckEnabled}
        onToggleSpellCheck={handleToggleSpellCheck}
        onTextTypeChange={handleTextTypeChange}
        onFontChange={handleFontChange}
        onFontSizeSelect={handleFontSizeSelect}
        onBoldClick={handleBoldClick}
        onItalicClick={handleItalicClick}
        onUnderlineClick={handleUnderlineClick}
        onStrikeClick={handleStrikeClick}
        onColorSelect={handleColorSelect}
        onHighlightSelect={handleHighlightSelect}
        onLinkClick={handleLinkClick}
        onAddComment={handleAddComment}
        onImageUpload={handleImageUpload}
        onTextAlignmentChange={handleTextAlignmentChange}
        onChecklistClick={handleChecklistClick}
        onUnorderedListClick={handleUnorderedListClick}
        onOrderedListClick={handleOrderedListClick}
        onIndentClick={handleIndentClick}
        onOutdentClick={handleIndentClick}
      />
      <div className="document">
        <ReactQuill
          className="editable-area"
          ref={quillRef}
          value={value}
          onChange={setValue}
          modules={modules}
        />
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-text">
                Comment: {comment.text}
                <div className="commented-text-preview">
                  Text:{" "}
                  {quillRef.current
                    ?.getEditor()
                    .getText(comment.rangeIndex, comment.rangeLength)}
                </div>
              </div>
              <button onClick={() => handleRemoveComment(comment.id)}>
                Remove Comment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Document;
