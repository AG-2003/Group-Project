import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

interface ChatContextType {
    currentChatId: string | null;
    setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
    chats: any[]; // Define a more specific type for chats
    addChat: (chat: any) => void; // Define parameters and return type more specifically
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useUserChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatContextProvider');
    }
    return context;
};

export const ChatContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const { chats, addChat } = useChat(currentChatId); // Assuming useChat provides these functionalities

    return (
        <ChatContext.Provider value={{ currentChatId, setCurrentChatId, chats, addChat }}>
            {children}
        </ChatContext.Provider>
    );
};
