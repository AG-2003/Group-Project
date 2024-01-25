import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import "./Sheet.scss";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { SuiteProps } from "../../interfaces/SuiteProps";
import { debounce } from "../../utils/Time";

interface Sheet {
  data: any;
  id: string;
  title: string;
  content: string;
  type: string;
  lastEdited: string;
  celldata?: any[]; // Add this line
 }

const Sheet: React.FC<SuiteProps> = ({ suiteTitle, suiteId, setSuiteTitle }: SuiteProps) => {
 const [workbookData, setWorkbookData] = useState(null);

//  const formatSheet = (sheet: Sheet) => {
//   const formattedSheet = {
//      ...sheet,
//      celldata: sheet.celldata || [],
//   };

//   formattedSheet.data?.forEach((row: any, rowIndex: any) => {
//      row.forEach((cell: any, columnIndex: any) => {
//        formattedSheet.celldata?.push({
//          r: rowIndex,
//          c: columnIndex,
//          v: cell,
//        });
//      });
//   });

//   delete formattedSheet.data;

//   return formattedSheet;
//  };
// data: [{ name: 'Sheet1', celldata: [{ r: 0, c: 0, v: null }] }], // sheet data

  // const settings = useMemo(() => ({

  //   onChange: (data: any) => {
  //     setWorkbookData(data);
  //     localStorage.setItem('workbookData', JSON.stringify(data));
  //   }
  //   // More other settings...
  // }), []);

  const settings = useMemo(() => ({
    // Initial data for the workbook, ensure it matches the Sheet[] type
    data: [{ name: 'Sheet1', celldata: [{ r: 0, c: 0, v: null }] }],
    onChange: (data: any) => {
      // Your onChange handler
      // console.log('this is the data being saved to workbookData \n');
      // console.log(data);
      setWorkbookData(data);
      localStorage.setItem('workbookData', JSON.stringify(data));
    }
  }), [setWorkbookData]
  )

 useEffect(() => {
    const savedData = localStorage.getItem('workbookData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setWorkbookData(parsedData);
    }
  }, []);

  // This useEffect will run whenever workbookData changes and log its value
  useEffect(() => {
    console.log("workbookData has been updated:", workbookData);
    console.log(localStorage)
  }, [workbookData]);

 return (
    <div className="containerSheet">
      <Workbook {...settings} />
    </div>
 );
};


// const Sheet: React.FC<SuiteProps> = ({ suiteTitle, suiteId, setSuiteTitle }: SuiteProps) => {
//   // State to hold workbook data
//   const [workbookData, setWorkbookData] = useState([{
//     data: [],
//     name: `${suiteTitle}`, // Default sheet name
//   }]);
//   // const [workbookData, setWorkbookData] = useState<any[]>([]);

//   const settings = {
//     // Initial data for the workbook

//     // Initial data for the workbook, ensure it matches the Sheet[] type
//     data: workbookData,
//     onChange: (newData: any) => {
//       if (JSON.stringify(newData) !== JSON.stringify(workbookData)) {
//         setWorkbookData(newData);
//       }
//    },
//     toolbarItems: [
//       "undo",
//       "redo",
//       "format-painter",
//       "clear-format",
//       "currency-format",
//       "percentage-format",
//       "number-decrease",
//       "number-increase",
//       "format",
//       "font-size",
//       "bold",
//       "italic",
//       "strike-through",
//       "underline",
//       "font-color",
//       "background",
//       "border",
//       "merge-cell",
//       "horizontal-align",
//       "vertical-align",
//       "text-wrap",
//       "text-rotation",
//       "freeze",
//       "sort",
//       "image",
//       "comment",
//       "quick-formula",
//     ],
//     // ... other settings
//   };

//   const [serializedData, setSerializedData] = useState<string>('');
//   const [user] = useAuthState(auth);

//   //---------------Function to save sheet to firebase

//   // Use useEffect to call saveDocumentToFirestore whenever the value changes

//   useEffect(() => {
//     setSerializedData(JSON.stringify(workbookData));
//     console.log(`Each time workbook data is logged into the console: ${count++}`)
//     console.log("This is the workBook data each time it changes:")
//     console.log(workbookData)
//   }, [workbookData]);

//   useEffect(() => {
//     const userEmail = user?.email;
//     if (userEmail) {
//       debouncedSaveSheetToFirestore(
//         userEmail,
//         suiteId,
//         suiteTitle,
//         serializedData
//       );
//     }
//   }, [serializedData, suiteTitle]);

//   const saveSheetToFirestore = async (
//     userEmail: string,
//     suiteId: string,
//     suiteTitle: string,
//     data: string
//   ) => {
//     try {
//       const userDocRef = doc(collection(db, "users"), userEmail);
//       // Get the current sheet to see if there are existing documents
//       const docSnapshot = await getDoc(userDocRef);
//       let sheetsArray: Sheet[] = [];

//       if (docSnapshot.exists()) {
//         // Get the existing sheets array or initialize it if it doesn't exist
//         sheetsArray = docSnapshot.data().sheets || [];
//       }

//       // Check if the sheet with the given ID already exists
//       const existingSheetIndex = sheetsArray.findIndex(
//         (sheet: Sheet) => sheet.id === suiteId
//       );

//       const now = new Date().toISOString();

//       if (existingSheetIndex !== -1) {
//         // Update the existing sheet's title and content
//         sheetsArray[existingSheetIndex] = {
//           ...sheetsArray[existingSheetIndex],
//           id: suiteId,
//           title: suiteTitle,
//           content: data,
//           lastEdited: now,
//         };
//       } else {
//         // Add a new sheet with a unique ID
//         sheetsArray.push({
//           id: suiteId,
//           title: suiteTitle,
//           content: data,
//           type: 'sheet',
//           lastEdited: now,
//         });
//       }

//       // Update the user's sheet with the new or updated sheets array
//       await setDoc(
//         userDocRef,
//         {
//           sheets: sheetsArray,
//         },
//         { merge: true }
//       );
//       console.log('this is the sheet you just made reflected in firestore: ', sheetsArray);
//     } catch (error) {
//       console.error("Error saving document:", error);
//     }
//   };

//   const debouncedSaveSheetToFirestore = debounce(
//     saveSheetToFirestore,
//     10000 // Delay in milliseconds
//   );
//   //___________________________________


//   //---------------Function to fetch the Sheet from firebase---------
//   useEffect(() => {
//     const username = user?.email
//     if(username){
//       fetchSheetFromFirestore(username);
//     }
//   }, []);

//   const fetchSheetFromFirestore = async (username: string) => {
//     try {
//       if (username) {
//         const userDocRef = doc(collection(db, "users"), username);
//         const docSnapshot = await getDoc(userDocRef);
//         if (docSnapshot.exists()) {
//           const sheetsArray: Sheet[] = docSnapshot.data().sheets || [];
//           const sheet = sheetsArray.find(sheet => sheet.id === suiteId);
//           if (sheet) {
//             console.log("From fetchDoc workbookData: sheetContent")
//             const sheetContent = JSON.parse(sheet.content)
//             console.log(sheetContent)
//             setWorkbookData(sheetContent)
//             console.log("From fetchDoc workbookData: workbookData")
//             console.log(workbookData)
//             setSuiteTitle(sheet.title)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching document:", error);
//     }
//   };



//   //_______________________________________________
//   return (
//     <div className="containerSheet">
//       <Workbook {...settings} />
//     </div>
//   );
// };

export default Sheet;
