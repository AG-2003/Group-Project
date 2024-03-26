export interface MessageItemProps {
    text: string;
    senderId: string;
    createdAt: Date | null; // Assuming the createdAt can be a Firestore Timestamp or null
    currentUserId: string; // To differentiate messages sent by the current user
    senderPhotoURL?: string
}
