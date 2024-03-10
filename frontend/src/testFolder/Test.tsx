import { app as firebaseApp } from '../firebase-config'
import * as Y from 'yjs'
import { FireProvider } from "y-fire";
import { useState, useEffect } from 'react';

//This is testing the synchronization of text

export default function Test() {
    const [collaborativeVar, setCollaborativeVar] = useState('');
    const [collaborativeArr, setCollaborativeArr] = useState<any[]>([]);
    const [ydoc, setYdoc] = useState<Y.Doc | null>(null); // Step 1: Define a state variable for ydoc

    // Combine collaborativeArr and collaborativeVar into a single state object
    const collaborativeObj = { collaborativeVar, collaborativeArr };

    useEffect(() => {
        const doc = new Y.Doc();
        const yText = doc.getText('sharedText'); // Create or get a shared Y.Text
        const yArray = doc.getArray('sharedArray'); // Create or get a shared Y.Array


        const yprovider = new FireProvider({ firebaseApp, ydoc: doc, path: `test/${1000}` });

        // Define the observer function
        const textObserver = (event: any) => {
            console.log("Text changed:", yText.toString());
            setCollaborativeVar(yText.toString());
        };

        // Define the observer function for Y.Array
        const arrayObserver = (event: any) => {
            console.log("Array changed:", yArray.toArray());
            setCollaborativeArr(yArray.toArray());
        };

        // Register the observers
        yText.observe(textObserver);
        yArray.observe(arrayObserver);

        // Step 2: Initialize ydoc in the useEffect hook and update the state variable
        setYdoc(doc);

        // Cleanup function
        return () => {
            yText.unobserve(textObserver); // Unregister the observer using the reference
            yArray.unobserve(arrayObserver);
            doc.destroy();
            yprovider.destroy();
        }
    }, []);

    // Log changes to the collaborative object
    useEffect(() => {
        console.log("Collaborative object changed:", collaborativeObj);
    }, [collaborativeObj]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCollaborativeVar(event.target.value); // Update local state

        // Use the state variable ydoc in the handleInputChange function
        if (ydoc) {
            const yText = ydoc.getText('sharedText');
            yText.delete(0, yText.length); // Remove current text
            yText.insert(0, event.target.value); // Insert new text
        }
    };

    const handleAddItem = (item: string) => {
        if (ydoc) {
            const yArray = ydoc.getArray('sharedArray');
            yArray.insert(yArray.length, [item]); // Insert the item at the end of the array
        }
    };

    return (
        <div>
            <input
                type="text"
                value={collaborativeVar}
                onChange={handleInputChange}
                placeholder="Enter text here"
            />
            <br/>
            <button
                onClick={() => handleAddItem(collaborativeVar)}
                style={{
                    border: '2px solid black',
                    padding: '10px',
                    margin: '10px 0',
                    cursor: 'pointer'
                }}
            >
                Add to Array
            </button>
            <br/>
            <ol>
                {collaborativeArr.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ol>
        </div>
    );
}
