import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import "./Sheet.scss";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { SuiteData } from "../../interfaces/SuiteData";
import { SuiteProps } from "../../interfaces/SuiteProps";
// import { SheetData } from "../../interfaces/SheetData";
import { debounce } from "../../utils/Time";






const Sheet: React.FC<SuiteProps> = ({ suiteId, suiteTitle }: SuiteProps) => {
  // State to hold workbook data
  const [workbookData, setWorkbookData] = useState([{ data: [], name: '' }]); // add type 
  const [serializedData, setSerializedData] = useState<string>('');

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


  //---------------Function to render the document in the database----------------
  useEffect(() => {
    const userEmail = user?.email
    if (userEmail) {
      fetchDocumentFromFirestore(userEmail);
    }
  }, []);

  const fetchDocumentFromFirestore = async (userEmail: string) => {
    try {
      if (userEmail && suiteId) {
        const userDocRef = doc(db, "users", userEmail);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const sheetArray: SuiteData[] = docSnapshot.data().sheets || [];
          const spreadsheet = sheetArray.find((sheet: SuiteData) => sheet.id === suiteId);
          if (spreadsheet) {
            const parsedData = JSON.parse(spreadsheet.content);
            setWorkbookData([{ ...parsedData, name: spreadsheet.title }]);

          }
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };




  const saveSheetToFirestore = async (
    userEmail: string,
    sheetId: string,
    suiteTitle: string,
  ) => {
    try {
      const userDocRef = doc(collection(db, "users"), userEmail);
      // Get the current sheet to see if there are existing documents
      const docSnapshot = await getDoc(userDocRef);
      let sheetsArray: SuiteData[] = [];

      if (docSnapshot.exists()) {
        // Get the existing sheets array or initialize it if it doesn't exist
        sheetsArray = docSnapshot.data().sheets || [];
      }

      // Check if the sheet with the given ID already exists
      const existingSheetIndex = sheetsArray.findIndex(
        (sheet: SuiteData) => sheet.id === sheetId
      );

      const now = new Date().toISOString();

      if (existingSheetIndex !== -1) {
        // Update the existing sheet's title and content
        sheetsArray[existingSheetIndex] = {
          ...sheetsArray[existingSheetIndex],
          title: suiteTitle,
          lastEdited: now,
          content: serializedData,
        };
      } else {
        // Add a new sheet with a unique ID
        sheetsArray.push({
          id: suiteId,
          title: suiteTitle,
          type: 'sheet',
          lastEdited: now,
          content: serializedData
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
    5000 // Delay in milliseconds
  );
  //___________________________________
  return (
    <div className="containerSheet">
      {suiteId && <Workbook {...settings} />}
    </div>
  );
};

export default Sheet;
