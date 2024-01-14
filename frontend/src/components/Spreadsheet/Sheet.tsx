import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import "./Toolbar.scss";

const Sheet = () => {
  const settings = {
    // Initial data for the workbook
    data: [
      {
        name: "Sheet1",
        celldata: [],
      },
    ],
    toolbarItems: [
      "undo",
      "redo",
      "format-painter",
      "clear-format",
      "currency-format",
      "percentage-format",
      "number-decrease",
      "number-increase",
      "format",
      "font-size",
      "bold",
      "italic",
      "strike-through",
      "underline",
      "font-color",
      "background",
      "border",
      "merge-cell",
      "horizontal-align",
      "vertical-align",
      "text-wrap",
      "text-rotation",
      "freeze",
      "sort",
      "image",
      "comment",
      "quick-formula",
    ],
    // ... other settings
  };

  return (
    <div className="containerSheet">
      <Workbook {...settings} />
    </div>
  );
};

export default Sheet;
