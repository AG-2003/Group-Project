import { app as firebaseApp } from '../firebase-config'
import * as Y from 'yjs'
import { FireProvider } from "y-fire";
import { useState, useEffect } from 'react';

export default function Test() {
    const [collaborativeVar, setCollaborativeVar] = useState('');

    useEffect(() => {
        const ydoc = new Y.Doc()
        const yText = ydoc.getText('sharedText'); // Create or get a shared Y.Text

        const yprovider = new FireProvider({ firebaseApp, ydoc, path: `test/${1000}` });

        // Define the observer function
        const textObserver = (event: any) => {
            setCollaborativeVar(yText.toString());
        };

        // Register the observer
        yText.observe(textObserver);

        // Cleanup function
        return () => {
            yText.unobserve(textObserver); // Unregister the observer using the reference
            ydoc.destroy();
            yprovider.destroy();
        }
    }, []);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCollaborativeVar(event.target.value); // Update local state

        // Update the Y.Text to propagate changes
        const ydoc = new Y.Doc();
        const yText = ydoc.getText('sharedText');
        yText.delete(0, yText.length); // Remove current text
        yText.insert(0, event.target.value); // Insert new text
    };

    return (
        <div>
            <input
                type="text"
                value={collaborativeVar}
                onChange={handleInputChange}
                placeholder="Enter text here"
            />
        </div>
    );
}
