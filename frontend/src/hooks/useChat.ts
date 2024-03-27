import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

export const useChat = (currentChatId: string | null) => {
    const [chats, setChats] = useState<any[]>([]); // Define a more specific type for chats

    useEffect(() => {
        // Example: Fetching chats. Adjust based on your app's requirements
        const fetchChats = async () => {
            const q = query(collection(db, 'chats'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chatsArray: any[] = []; // Use a more specific type
                querySnapshot.forEach((doc) => {
                    chatsArray.push({ id: doc.id, ...doc.data() });
                });
                setChats(chatsArray);
            });

            return unsubscribe; // Cleanup subscription
        };

        fetchChats();
    }, []);

    const addChat = async (chat: any) => { // Define parameters more specifically
        // Example: Adding a new chat document to Firestore
        await addDoc(collection(db, 'chats'), chat);
    };

    return { chats, addChat };
};
