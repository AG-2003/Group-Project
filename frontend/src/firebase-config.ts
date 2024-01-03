// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


export const auth = getAuth(app);

const analytics = getAnalytics(app);