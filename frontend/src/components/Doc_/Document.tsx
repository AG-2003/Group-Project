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

// Document.tsx
// import React from "react";
// import { Editor, EditorState } from "draft-js";
// import "draft-js/dist/Draft.css";

// // Define the type for the props the Document component will accept
// interface DocumentProps {
//   editorState: EditorState;
//   setEditorState: (editorState: EditorState) => void;
// }

// const Document: React.FC<DocumentProps> = ({ editorState, setEditorState }) => {
//   return (
//     <div className="document">
//       <Editor editorState={editorState} onChange={setEditorState} />
//     </div>
//   );
// };

// export default Document;

// In your Document component, attach the ref to the Editor
// Document.tsx
import React from "react";
import { Editor, EditorState } from "draft-js";

interface DocumentProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  editorRef: React.RefObject<Editor>; // Include this line
}

const Document: React.FC<DocumentProps> = ({
  editorState,
  setEditorState,
  editorRef, // Destructure editorRef from props
}) => {
  return (
    <div className="document">
      <Editor
        ref={editorRef} // Attach the ref here
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Enter some text..."
      />
    </div>
  );
};

export default Document;
