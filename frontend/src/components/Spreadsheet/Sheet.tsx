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
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Workbook {...settings} />
    </div>
  );
};

export default Sheet;
