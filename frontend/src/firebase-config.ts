// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
    apiKey: "AIzaSyAARbN47qLYgqawlQ_r7q2yGHz0X2kcuE0",
    authDomain: "f29so-group-project-85f3b.firebaseapp.com",
    databaseURL: "https://f29so-group-project-85f3b-default-rtdb.firebaseio.com",
    projectId: "f29so-group-project-85f3b",
    storageBucket: "f29so-group-project-85f3b.appspot.com",
    messagingSenderId: "4590697151",
    appId: "1:4590697151:web:5884f4a1168e745ec6e40a",
    measurementId: "G-FFYDN4976E"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// initialize firestore database
export const db = getFirestore(app);

export const storage = getStorage(app);
// Microsoft OAuth provider configuration
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
    // Add your Microsoft client_id here
    clientId: 'ad1d4e30-d1fe-42fb-b88d-5ba541daa3df',
});

// Google Auth provider configuration
export const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app);

// const analytics = getAnalytics(app);