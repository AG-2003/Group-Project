import { Workbook } from "@fortune-sheet/react";
import { Sheet as SheetData } from "@fortune-sheet/core";
import "@fortune-sheet/react/dist/index.css";
import "./Sheet.scss";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useCallback, useEffect, useMemo, useState } from "react";
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


const TOOLBAR_ITEMS = [
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
];

const Sheet: React.FC<SuiteProps> = ({ suiteTitle, suiteId, setSuiteTitle }: SuiteProps) => {
  // State to hold workbook data
  const [workbookData, setWorkbookData] = useState<SheetData[]>([{
    name: `${suiteTitle}`, // Default sheet name
    id: '',
    status: 0,
  }]);

  // // console.log('this is the initial data \n')
  // // console.log(workbookData);
  const [serializedData, setSerializedData] = useState<string>('');
  const [user] = useAuthState(auth);

  const onChange = useCallback((data: any) => {
    setWorkbookData(data);
  }, [setWorkbookData]);

  //---------------Function to save sheet to firebase



  // Use useEffect to call saveDocumentToFirestore whenever the value changes

  useEffect(() => {
    // console.log('this is the data being serialized which is then sent to firebase \n');
    // console.log(workbookData);
    setSerializedData(JSON.stringify(workbookData));
    // console.log('CHECK', serializedData);
  }, [workbookData]);

  const saveSheetToFirestore = useCallback(async (
    userEmail: string,
    suiteId: string,
    suiteTitle: string,
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
          title: suiteTitle,
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
      // console.log('this is the sheet you just made reflected in firestore: ', sheetsArray);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  }, []);

  const debouncedSaveSheetToFirestore = useMemo(() => debounce(
    saveSheetToFirestore,
    10000 // Delay in milliseconds
  ), [saveSheetToFirestore]);

  useEffect(() => {
    const userEmail = user?.email;
    if (userEmail) {

      // console.log(`this is the workbook data being sent to firebase: \n`);
      // console.log(serializedData);
      debouncedSaveSheetToFirestore(
        userEmail,
        suiteId,
        suiteTitle,
        serializedData
      );
    }
  }, [serializedData, suiteTitle, user, debouncedSaveSheetToFirestore, suiteId]);


  //___________________________________


  //---------------Function to fetch the Sheet from firebase---------

  useEffect(() => {
    console.log('Updated workbookData:', workbookData);
  }, [workbookData]);


  const fetchSheetFromFirestore = useCallback(async (userEmail: string, abortController: AbortController) => {
    console.log('TRIGGERING FETVCH')
    try {
      const userDocRef = doc(db, "users", userEmail);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData && userData.sheets) {
          const sheetsArray: Sheet[] = userData.sheets;
          const sheet = sheetsArray.find(sheet => sheet.id === suiteId);
          if (sheet && sheet.content) {

            // console.log('this is what you are trying to set in workbookData \n');
            // console.log(sheet.content);
            try {
              const parsedData = JSON.parse(sheet.content) as SheetData[];
              console.log("PARSED", parsedData);
              if (!abortController.signal.aborted) {
                const newWorkbookData = parsedData.map(item => ({
                  ...item,
                  celldata: item.data?.flatMap((d, i) => d.map((c, j) => c ? ({ r: i, c: j, v: c }) : null).filter(x => x != null)),
                })) as SheetData[];
                setWorkbookData(newWorkbookData);
                console.log('THIS IS THE UPDATED WORKBOOK DATA AFTER FETCH');
              }
            } catch (error) {
              console.error("Error parsing sheet content:", error);
            }
            if (!abortController.signal.aborted) {
              setSuiteTitle(sheet.title); // Update the state with the sheet title
            }

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
  }, [setWorkbookData, setSuiteTitle, suiteId]);


  useEffect(() => {
    const userEmail = user?.email;
    const abortController = new AbortController();
    if (userEmail) {
      fetchSheetFromFirestore(userEmail, abortController);
    }

    return () => {
      abortController.abort();
    };
  }, [user, fetchSheetFromFirestore]); // Dependencies array includes user and suiteId


  //_______________________________________________
  return (
    <div className="containerSheet">

      {/* <Workbook data={[{ name: "Test X", id: "", status: 1, celldata: [{ r: 0, c: 0, v: { v: "asd" } }] }]} onChange={onChange} toolbarItems={TOOLBAR_ITEMS} /> */}
      <Workbook data={workbookData.map(d => {
        console.log("TEST 1:", d.name, d.celldata) // should also be [{ c: 0, r: 0, v: { ct: { fa: "General", t: "g" }, m: "Test", v: "Test" } }]
        const staticVal = [{ c: 0, r: 0, v: { ct: { fa: "General", t: "g" }, m: "Test", v: "Test" } }];
        console.log("TEST 2:", d.name, staticVal)

        return ({
          ...d,
          data: undefined,
          // celldata: staticVal,
          celldata: d.celldata,
        })
      })} onChange={onChange} toolbarItems={TOOLBAR_ITEMS} />
    </div>
  );
};

export default Sheet;
