// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJbw7uTkzDIz2xhj3NqB4PpoMjxMzZ-Gk",
    authDomain: "graduation-project-c1edb.firebaseapp.com",
    projectId: "graduation-project-c1edb",
    storageBucket: "graduation-project-c1edb.appspot.com",
    messagingSenderId: "942927609886",
    appId: "1:942927609886:web:2ec5609577fb1465db6e0f",
    measurementId: "G-P0SDJ96KNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the auth object using getAuth function

export { auth }; // Export the auth object