import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config"
import { EventType } from "../interfaces/EventType";



export const fetchTodaysEvents = async (email: string) => {
    if (!email) return;
    const userDocRef = doc(db, 'users', email);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists() && userDocSnap.data()) {
        const userEvents: EventType[] = userDocSnap.data().events;
        return userEvents;
    }


}