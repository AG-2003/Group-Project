import React, { useState } from "react";
import { ReactGrid, Row, HeaderCell, TextCell } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.scss";
import "./Sheet.scss";

// Helper function to create a header cell
const getHeaderCell = (text: string): HeaderCell => ({
  text,
  type: "header",
});

// Helper function to create a text cell
const getTextCell = (text: string): TextCell => ({
  text,
  type: "text",
});

const generateRows = (rowCount: number, columnCount: number): Row[] => {
  // Create the header row with column labels (adjusting for the extra row number column)
  const headerRow: Row = {
    rowId: "header",
    cells: [
      getHeaderCell(""), // The top-left corner cell, could be left empty or labeled as needed
      ...Array.from(
        { length: columnCount },
        (_, columnIndex) => getHeaderCell(String.fromCharCode(65 + columnIndex)) // A, B, C, etc.
      ),
    ],
  };

  // Generate the data rows, each starting with a row number header cell
  const dataRows: Row[] = Array.from({ length: rowCount }, (_, rowIndex) => ({
    rowId: rowIndex + 1, // Row numbers start at 1 for readability
    cells: [
      getHeaderCell((rowIndex + 1).toString()), // Add row number as the first cell of each row
      ...Array.from({ length: columnCount }, () => getTextCell("")), // The rest are text cells
    ],
  }));

  return [headerRow, ...dataRows];
};

const generateColumns = (columnCount: number) => {
  // Add an extra column for the row numbers
  return [
    { columnId: "rowHeader", width: 50 }, // Width can be adjusted as needed for row number column
    ...Array.from({ length: columnCount }, (_, columnIndex) => ({
      columnId: String.fromCharCode(65 + columnIndex), // A, B, C, etc.
      width: 100,
    })),
  ];
};

// Spreadsheet component
const Sheet: React.FC = () => {
  const rowCount = 100; // Adjust the number of rows as needed
  const columnCount = 26; // Adjust the number of columns as needed (26 for A-Z)

  // Initialize rows and columns using the helper functions
  const [rows] = useState<Row[]>(generateRows(rowCount, columnCount));
  const [columns] = useState(generateColumns(columnCount)); // Removed <GridColumn[]> type

  return (
    <div style={{ height: "80vh" }}>
      {" "}
      {/* Adjust the height as needed */}
      <ReactGrid
        rows={rows}
        columns={columns}
        // Add other required props and event handlers
      />
    </div>
  );
};

export default Sheet;
