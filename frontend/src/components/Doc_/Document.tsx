import { useRef, useState, useMemo } from "react";
import ReactQuill from "react-quill";
// import Quill from "quill";
import ToolBar from "./ToolBar"; // Adjust the path as needed

import "react-quill/dist/quill.snow.css";
import "./Document.scss";

// A simple debounce function
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const Document = () => {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = debounce((searchTerm) => {
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
    const editor = quillRef.current.getEditor();
    editor.history.undo();
  };

  const handleRedo = () => {
    const editor = quillRef.current.getEditor();
    editor.history.redo();
  };

  const [isSpellCheckEnabled, setSpellCheckEnabled] = useState(true); // Initial spell check state

  const handleToggleSpellCheck = () => {
    const editor = quillRef.current.getEditor();
    const editorElem = editor.root; // This is the editor element
    editorElem.spellcheck = !isSpellCheckEnabled; // Toggle the spellcheck attribute
    setSpellCheckEnabled(!isSpellCheckEnabled); // Update state
  };

  const handleTextTypeChange = (format, level) => {
    const editor = quillRef.current.getEditor();
    if (format === "normal") {
      editor.format("header", false); // Removes any header formatting
    } else {
      editor.format(format, level || false); // Apply header level or blockquote
    }
  };

  const handleFontChange = (font) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("font", font.toLowerCase().replace(/\s/g, "-"));
    }
  };

  const handleFontSizeSelect = (size) => {
    const editor = quillRef.current.getEditor();
    editor.format("size", size);
  };

  const handleBoldClick = () => {
    const editor = quillRef.current.getEditor();
    editor.format("bold", !editor.getFormat().bold);
  };

  const handleItalicClick = () => {
    const editor = quillRef.current.getEditor();
    editor.format("italic", !editor.getFormat().italic);
  };

  const handleUnderlineClick = () => {
    const editor = quillRef.current.getEditor();
    editor.format("underline", !editor.getFormat().underline);
  };

  const handleStrikeClick = () => {
    const editor = quillRef.current.getEditor();
    editor.format("strike", !editor.getFormat().strike);
  };

  const handleColorSelect = (color) => {
    const editor = quillRef.current.getEditor();
    editor.format("color", color);
  };

  const handleHighlightSelect = (color) => {
    const editor = quillRef.current.getEditor();
    editor.format("background", color);
  };

  const handleLinkClick = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    if (range) {
      const url = prompt("Enter the URL");
      if (url) {
        editor.format("link", url);
      }
    }
  };

  const [comments, setComments] = useState([]); // This state will keep track of comments

  // ... In the Document component ...

  const handleAddComment = () => {
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
        editor.formatText(range.index, range.length, "ql-commented-text", true);
      }
    } else {
      alert("Please select text to comment on.");
    }
  };

  const handleRemoveComment = (commentId) => {
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
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, "image", reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const handleTextAlignmentChange = (alignment) => {
    const editor = quillRef.current.getEditor();
    editor.format("align", alignment);
  };

  const handleChecklistClick = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    if (range) {
      const format = editor.getFormat(range.index, range.length);
      editor.format("list", format.list === "checked" ? null : "checked");
    }
  };

  const handleUnorderedListClick = () => {
    const editor = quillRef.current.getEditor();
    const format = editor.getFormat();
    editor.format("list", format.list === "bullet" ? null : "bullet");
  };

  const handleOrderedListClick = () => {
    const editor = quillRef.current.getEditor();
    const format = editor.getFormat();
    editor.format("list", format.list === "ordered" ? null : "ordered");
  };

  const handleIndentClick = (direction) => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    if (range) {
      const currentIndent = editor.getFormat(range).indent || 0;
      const newIndent =
        direction === "indent" ? currentIndent + 1 : currentIndent - 1;
      editor.format("indent", newIndent > 0 ? newIndent : false);
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
      // You don't need to include the 'list' configuration here if you are using a custom toolbar.
      // The 'list' option should be included in the toolbar configuration if you were not using a custom toolbar.
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
                    .getEditor()
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
