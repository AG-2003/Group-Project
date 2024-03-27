// chatService.ts
import { db } from '../firebase-config';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    doc,
    getDocs,
    DocumentData,
    CollectionReference,
    Query
} from 'firebase/firestore';

interface Chat {
    participants: string[];
    createdAt: typeof serverTimestamp;
}

interface Message {
    senderId: string;
    text: string;
    createdAt: typeof serverTimestamp;
    userPhotoURL: string
}

const chatsCol = collection(db, 'chats') as CollectionReference<Chat>;
const getMessagesCol = (chatId: string) => collection(db, `chats/${chatId}/messages`) as CollectionReference<Message>;

// Create a new chat session
const createChat = async (participants: string[]) => {
    return await addDoc(chatsCol, {
        participants,
        createdAt: serverTimestamp(),
    });
};

// Send a message in a chat session
const sendMessage = async (chatId: string, senderId: string, text: string, userPhotoURL: string) => {
    const messagesCol = getMessagesCol(chatId);
    return await addDoc(messagesCol, {
        senderId,
        text,
        createdAt: serverTimestamp(),
        userPhotoURL,
    });
};

// Subscribe to chat session updates
const onChatsUpdate = (userId: string, callback: (chats: DocumentData[]) => void) => {
    const q = query(chatsCol, where('participants', 'array-contains', userId));
    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(chats);
    });
};

// Subscribe to messages within a chat session
const onMessagesUpdate = (chatId: string, callback: (messages: DocumentData[]) => void) => {
    const messagesCol = getMessagesCol(chatId);
    const q = query(messagesCol, where('createdAt', '!=', 'null')); // Adjust based on your needs
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};

// Fetch all chats for a user
const fetchChats = async (userId: string) => {
    const q = query(chatsCol, where('participants', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
const getOrCreateChatId = async (userEmail: string, friendEmail: string): Promise<string> => {
    // Check if a chat session already exists between the two users
    const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userEmail)
    );
    const chatsSnapshot = await getDocs(chatsQuery);
    let chatId = '';

    // Try to find a chat session that includes both users
    chatsSnapshot.forEach((chat) => {
        const data = chat.data();
        if (data.participants.includes(friendEmail)) {
            chatId = chat.id;
        }
    });

    // If a chat session exists, return its id
    if (chatId) {
        return chatId;
    }

    // If not, create a new chat session
    const chatDocRef = await addDoc(collection(db, 'chats'), {
        participants: [userEmail, friendEmail],
        createdAt: serverTimestamp()
    });

    return chatDocRef.id;
};

export { getOrCreateChatId, createChat, sendMessage, onChatsUpdate, onMessagesUpdate, fetchChats };
