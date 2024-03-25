import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../firebase-config'; // Adjust the import path as necessary
import { onSnapshot, doc } from 'firebase/firestore';

interface ReceivedRequestsContextType {
    receivedRequests: string[];
    setReceivedRequests: (requests: string[]) => void;
}

const defaultContextValue: ReceivedRequestsContextType = {
    receivedRequests: [],
    setReceivedRequests: () => { }
};

const ReceivedRequestsContext = createContext<ReceivedRequestsContextType>(defaultContextValue);

export const useReceivedRequests = () => useContext(ReceivedRequestsContext);

interface ReceivedRequestsProviderProps {
    children: ReactNode;
}

export const ReceivedRequestsProvider: React.FC<ReceivedRequestsProviderProps> = ({ children }) => {
    const [receivedRequests, setReceivedRequests] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const userDocRef = doc(db, 'users', user.email as string);
                const unsubscribeFromRequests = onSnapshot(userDocRef, (doc) => {
                    const data = doc.data();
                    if (data && data.receivedRequests) {
                        setReceivedRequests(data.receivedRequests);
                    } else {
                        setReceivedRequests([]);
                    }
                });

                return () => unsubscribeFromRequests();
            } else {
                setReceivedRequests([]);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <ReceivedRequestsContext.Provider value={{ receivedRequests, setReceivedRequests }}>
            {children}
        </ReceivedRequestsContext.Provider>
    );
};
