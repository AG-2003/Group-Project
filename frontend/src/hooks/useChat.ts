import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

export const useChat = (currentChatId: string | null) => {
    const [chats, setChats] = useState<any[]>([]); 

    useEffect(() => {
        
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

    const addChat = async (chat: any) => { 
        
        await addDoc(collection(db, 'chats'), chat);
    };

    return { chats, addChat };
};
