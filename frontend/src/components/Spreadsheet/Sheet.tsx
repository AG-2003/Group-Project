import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import "./Sheet.scss";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { SuiteProps } from "../../interfaces/SuiteProps";
import { debounce } from "../../utils/Time";
import { parse } from "path";


interface SheetData {
  // id: string; // Unique identifier for each sheet
  title: string;
  name: string;
  data: string; // Array of cell data for the sheet
  // Add other properties as needed
}

interface Sheet {
  id: string;
  title: string
  content: SheetData
  type: string
  lastEdited: string
}


const Sheet: React.FC<SuiteProps> = ({ suiteTitle, suiteId, setSuiteTitle }: SuiteProps) => {
  // State to hold workbook data
  const [workbookData, setWorkbookData] = useState([{ data: [], id: '', name: '', status: 0 }]); // add type
  const [serializedData, setSerializedData] = useState<string>('');
  // const [isLoading, setIsLoading] = useState(true); // New loading state


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
    console.log(serializedData)
  }, [workbookData[0]]);

  useEffect(() => {
    const userEmail = user?.email;
    if (userEmail) {
      const newWorkbookData = {
        ...workbookData[0],
        data: serializedData
      };

      debouncedSaveSheetToFirestore(
        userEmail,
        suiteId,
        suiteTitle,
        newWorkbookData
      );
    }
  }, [serializedData, suiteTitle]);

  const saveSheetToFirestore = async (
    userEmail: string,
    suiteId: string,
    sheetTitle: string,
    data: SheetData
  ) => {
    try {
      const userDocRef = doc(collection(db, "users"), userEmail);
      // Get the current sheet to see if there are existing documents
      const docSnapshot = await getDoc(userDocRef);
      let sheetsArray: Sheet[] = [];

      if (docSnapshot.exists()) {
        // Get the existing sheets array or initialize it if it doesn't exist
        sheetsArray = docSnapshot.data().sheets || [];
      }

      // Check if the sheet with the given ID already exists
      const existingSheetIndex = sheetsArray.findIndex(
        (sheet: Sheet) => sheet.id === suiteId
      );

      const now = new Date().toISOString();

      if (existingSheetIndex !== -1) {
        // Update the existing sheet's title and content
        sheetsArray[existingSheetIndex] = {
          ...sheetsArray[existingSheetIndex],
          id: suiteId,
          title: sheetTitle,
          content: data,
        };
      } else {
        // Add a new sheet with a unique ID
        sheetsArray.push({
          id: suiteId,
          title: suiteTitle,
          content: data,
          type: 'sheet',
          lastEdited: now
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
      console.log(sheetsArray);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const debouncedSaveSheetToFirestore = debounce(
    saveSheetToFirestore,
    10000 // Delay in milliseconds
  );
  //___________________________________


//---------------Function to save the Sheet to firebase---------
useEffect(() => {
  const userEmail = user?.email;
  if (userEmail) {
    // fetchSheetFromFirestore(userEmail, suiteId);
  }
}, [user, suiteId]); // Dependencies array includes user and suiteId

// const fetchSheetFromFirestore = async (userEmail: string, sheetId: string) => {
//   try {
//     const userDocRef = doc(db, "users", userEmail);
//     const docSnapshot = await getDoc(userDocRef);
//     if (docSnapshot.exists()) {
//       const userData = docSnapshot.data();
//       if (userData && userData.sheets) {
//         const sheetsArray: Sheet[] = userData.sheets;
//         const sheet = sheetsArray.find(sheet => sheet.id === sheetId);
//         if (sheet) {
//           // Assuming the content property of the sheet is the serialized data
//           const sheetContent = JSON.parse(sheet.content.data);
//           setWorkbookData(sheetContent); // Update the state with the sheet content
//           setSuiteTitle(sheet.title); // Update the state with the sheet title
//           setIsLoading(false); // Set loading to false after data is loaded
//         } else {
//           console.error("No sheet found with the given ID:", sheetId);
//           setIsLoading(false);
//         }
//       } else {
//         console.error("User data does not contain 'sheets' property:", userData);
//         setIsLoading(false);
//       }
//     } else {
//       console.error("No document found for the user:", userEmail);
//       setIsLoading(false);
//     }
//   } catch (error) {
//     console.error("Error fetching sheet from Firestore:", error);
//     setIsLoading(false);
//   }
// };
//_______________________________________________
  return (
    <div className="containerSheet">
      {/* {isLoading ? (
        <div>Loading...</div>
      ) : (
        suiteId && <Workbook {...settings} />
      )} */}
      <Workbook {...settings} />
    </div>
  );
};

export default Sheet;
