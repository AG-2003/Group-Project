// import React from "react";
// import "./Document.scss";

// const Document: React.FC = () => {
//   return (
//     <div className="document">
//       <textarea className="editable-area"></textarea>
//     </div>
//   );
// };

// export default Document;

// Editor.js or Editor.tsx
import React, { useRef, useState, useMemo } from "react";
import ReactQuill from "react-quill";
import ToolBar from "./ToolBar"; // Adjust the path as needed

import "react-quill/dist/quill.snow.css";
import "./Document.scss";

const Document = () => {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const handleFontChange = (e) => {
    const font = e.target.value;
    const editor = quillRef.current.getEditor();
    editor.format("font", font.toLowerCase().replace(/\s/g, "-")); // Format the font name as needed
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

  const modules = useMemo(
    () => ({
      toolbar: false,
    }),
    []
  );

  return (
    <div>
      {/* <NavBar /> */}
      <ToolBar
        onFontChange={handleFontChange}
        onFontSizeSelect={handleFontSizeSelect}
        onBoldClick={handleBoldClick}
        onItalicClick={handleItalicClick}
        onUnderlineClick={handleUnderlineClick}
        onStrikeClick={handleStrikeClick}
        onColorSelect={handleColorSelect}
        onHighlightSelect={handleHighlightSelect}
        onLinkClick={handleLinkClick}
        onImageUpload={handleImageUpload}
      />
      <div className="document">
        <ReactQuill
          className="editable-area"
          ref={quillRef}
          // theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
        />
      </div>
    </div>
  );
};

export default Document;
