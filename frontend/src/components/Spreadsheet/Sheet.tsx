import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import "./Sheet.scss";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { SuiteProps } from "../../interfaces/SuiteProps";
import { debounce } from "../../utils/Time";





interface Sheet {
  id: string;
  title: string;
  content: string
  type: string;
  lastEdited: string;
}



const Sheet: React.FC<SuiteProps> = ({ suiteTitle, suiteId, setSuiteTitle }: SuiteProps) => {
  // State to hold workbook data
  const [workbookData, setWorkbookData] = useState([{
    data: [], // assuming this represents cell data for one sheet
    name: 'Sheet1', // default name for a new sheet
    // include any other required properties according to the Fortune Sheet SDK
  }]);
  const [serializedData, setSerializedData] = useState<string>('');



  const settings = {
    // Initial data for the workbook

    // Initial data for the workbook, ensure it matches the Sheet[] type
    data: workbookData.map(sheet => ({
      ...sheet, // spread the existing properties
      name: sheet.name || 'Default Sheet Name', // ensure there's a name property
    })),
    onChange: (data: any) => {
      // Your onChange handler
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
    setSerializedData(JSON.stringify(workbookData));
    console.log('CHECK', serializedData);
  }, [workbookData]);

  useEffect(() => {
    const userEmail = user?.email;
    if (userEmail) {
      const newWorkbookData = {
        serializedData
      };
      console.log(`this is the workbook data being sent to firebase: ${newWorkbookData}`);
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
    data: string
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
          lastEdited: now
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
      fetchSheetFromFirestore(userEmail, suiteId);
    }
  }, [user, suiteId]); // Dependencies array includes user and suiteId

  const fetchSheetFromFirestore = async (userEmail: string, suiteId: string) => {
    try {
      const userDocRef = doc(db, "users", userEmail);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData && userData.sheets) {
          const sheetsArray: Sheet[] = userData.sheets;
          const sheet = sheetsArray.find(sheet => sheet.id === suiteId);
          if (sheet && sheet.content) {
            setSuiteTitle(sheet.title); // Update the state with the sheet title
            // Parse the serialized data to get the workbook data
            const workbookObject = JSON.parse(sheet.content);
            // const workbookDataArray = workbookObject.data;
            console.log(`this is the workBook data array: ${workbookObject}`);
            setWorkbookData(workbookObject);


          } else {
            console.error("No sheet found with the given ID or missing content:", suiteId);
          }
        } else {
          console.error("User data does not contain 'sheets' property:", userData);
        }
      } else {
        console.error("No document found for the user:", userEmail);
      }
    } catch (error) {
      console.error("Error fetching sheet from Firestore:", error);
    }
  };



  //_______________________________________________
  return (
    <div className="containerSheet">

      <Workbook {...settings} />
    </div>
  );
};

export default Sheet;
