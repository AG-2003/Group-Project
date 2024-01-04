import React from "react";
import "./Document.scss";

const Document: React.FC = () => {
  return (
    <div className="document">
      <textarea className="editable-area"></textarea>
    </div>
  );
};

export default Document;
