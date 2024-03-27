import { Timestamp } from 'firebase/firestore'; // Add this import

export interface ChatSession {
    chatId: string;
    participants: string[]; // Array of email addresses
    lastMessage?: string;
    lastMessageTimestamp?: Timestamp; // Use Timestamp directly
}
