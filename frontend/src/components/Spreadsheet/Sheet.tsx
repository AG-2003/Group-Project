// import React, { useState } from "react";
// import Spreadsheet, { Matrix } from "react-spreadsheet";
// import Toolbar from "./Toolbar"; // Assuming Toolbar is in the same directory

// // ... (Other imports and code)

// const Sheet = () => {
//   // Create a matrix with 100 rows and 26 columns
//   const createEmptyMatrix = (rows: number, columns: number): Matrix<any> => {
//     return Array.from({ length: rows }, () =>
//       Array.from({ length: columns }, () => ({ value: "" }))
//     );
//   };
//   const [data, setData] = useState<Matrix<any>>(createEmptyMatrix(100, 26));

//   // Implement the required functions for the Toolbar component
//   // Here we just implement a dummy function for onFill
//   const handleFill = () => {
//     // Logic to fill selected cells with "Hello World"
//     // This is a placeholder, as `react-spreadsheet` does not provide cell selection out of the box
//     const newData = data.map((row) =>
//       row.map((cell) => ({ ...cell, value: "Hello World" }))
//     );
//     setData(newData);
//   };

//   // Placeholder functions for other Toolbar actions
//   const handleSearch = (searchTerm: string) => {
//     /* ... */
//   };
//   const handleUndo = () => {
//     /* ... */
//   };
//   // ... (Other handler functions)

//   // You would replace the following with actual state logic
//   const isSearchVisible = false;
//   const toggleSearchVisibility = () => {
//     /* ... */
//   };
//   const isSpellCheckEnabled = false;
//   // ... (Other state/logic for toolbar visibility and features)

//   return (
//     <div>
//       <Toolbar
//         onSearch={handleSearch}
//         isSearchVisible={isSearchVisible}
//         toggleSearchVisibility={toggleSearchVisibility}
//         onUndo={handleUndo}
//         // ... (Pass all required props to Toolbar)
//         // For now, we're assuming all buttons in the toolbar fill the cells with "Hello World"
//         onRedo={handleFill}
//         onToggleSpellCheck={handleFill}
//         onTextTypeChange={(format, level) => handleFill()}
//         onFontChange={handleFill}
//         onFontSizeSelect={handleFill}
//         onBoldClick={handleFill}
//         onItalicClick={handleFill}
//         onUnderlineClick={handleFill}
//         onStrikeClick={handleFill}
//         onColorSelect={handleFill}
//         onHighlightSelect={handleFill}
//         onLinkClick={handleFill}
//         onImageUpload={handleFill}
//         onTextAlignmentChange={handleFill}
//         onChecklistClick={handleFill}
//         onUnorderedListClick={handleFill}
//         onOrderedListClick={handleFill}
//         onIndentClick={handleFill}
//         onOutdentClick={handleFill}
//         isSpellCheckEnabled={false}
//       />
//       <div className="contentSheet">
//         <Spreadsheet className="test" data={data} onChange={setData} />
//       </div>
//     </div>
//   );
// };

// export default Sheet;

import React from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

const Sheet = () => {
  const settings = {
    // Initial data for the workbook
    data: [
      {
        name: "Sheet1",
        celldata: [],
      },
    ],

    // onChange event handler (optional)
    onChange: (data: any) => {
      console.log("Data changed:", data);
    },

    // // Additional settings (optional)
    // showToolbar: true,
    // showSheetTabs: true,
    // showFormulaBar: true,
    // defaultFontSize: 11,

    // // Customizing the toolbar (optional)
    // toolbarItems: [
    //   "undo",
    //   "redo",
    //   "|",
    //   "bold",
    //   "italic",
    //   "underline",
    //   "|",
    //   // ... other toolbar items
    // ],

    // // Cell context menu customization (optional)
    // cellContextMenu: [
    //   "copy",
    //   "paste",
    //   "|",
    //   "insert-row",
    //   "insert-column",
    //   // ... other context menu items
    // ],

    // // Sheet tab context menu customization (optional)
    // sheetTabContextMenu: [
    //   "delete",
    //   "copy",
    //   "rename",
    //   // ... other tab context menu items
    // ],
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Workbook {...settings} />
    </div>
  );
};

export default Sheet;
