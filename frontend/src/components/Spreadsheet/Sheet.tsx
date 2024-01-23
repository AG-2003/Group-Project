import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import "./Sheet.scss";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  documentId: string;
  documentTitle: string;
}

interface SheetData {
  id: string; // Unique identifier for each sheet
  title: string;
  name: string;
  data: string; // Array of cell data for the sheet
  // Add other properties as needed
 }

 interface Sheet {
  id: string;
  title: string
  content: SheetData
 }

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

const Sheet: React.FC<Props> = ({ documentTitle, documentId }: Props) => {
  // State to hold workbook data
  const [workbookData, setWorkbookData] = useState([{ id: '', title: '', data: [], name: '' }]);
  const [serializedData, setSerializedData] = useState('');

  const settings = {
    // Initial data for the workbook
    data: workbookData,
    onChange: (data: any) => {
      setWorkbookData(data);
    },
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

  //---------------Function to save sheet to firebase

  const [user] = useAuthState(auth);

  // Use useEffect to call saveDocumentToFirestore whenever the value changes

  useEffect(() => {
   setSerializedData(JSON.stringify(workbookData[0]));
  }, [workbookData[0]]);

  useEffect(() => {
   const username = user?.email;
   if (username) {
     const newWorkbookData = {
       ...workbookData[0],
       data: serializedData
     };

     debouncedSaveSheetToFirestore(
       username,
       documentId,
       documentTitle,
       newWorkbookData
     );
   }
  }, [serializedData, documentTitle]);

  const saveSheetToFirestore = async (
    username: string,
    sheetId: string,
    sheetTitle: string,
    data: SheetData
  ) => {
    try {
      const userDocRef = doc(collection(db, "users"), username);
      // Get the current sheet to see if there are existing documents
      const docSnapshot = await getDoc(userDocRef);
      let sheetsArray: Sheet[] = [];

      if (docSnapshot.exists()) {
        // Get the existing sheets array or initialize it if it doesn't exist
        sheetsArray = docSnapshot.data().sheets || [];
      }

      // Check if the sheet with the given ID already exists
      const existingSheetIndex = sheetsArray.findIndex(
        (sheet: Sheet) => sheet.id === sheetId
      );

      if (existingSheetIndex !== -1) {
        // Update the existing sheet's title and content
        sheetsArray[existingSheetIndex] = {
          id: sheetId,
          title: sheetTitle,
          content: data,
        };
      } else {
        // Add a new sheet with a unique ID
        sheetsArray.push({
          id: documentId,
          title: documentTitle,
          content: data,
        });
      }

      // Update the user's sheet with the new or updated sheets array
      await setDoc(
        userDocRef,
        {
          sheets: sheetsArray,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const debouncedSaveSheetToFirestore = debounce(
    saveSheetToFirestore,
    10000 // Delay in milliseconds
  );
  //___________________________________
  return (
    <div className="containerSheet">
      {documentId && <Workbook {...settings} />}
    </div>
  );
};

export default Sheet;
