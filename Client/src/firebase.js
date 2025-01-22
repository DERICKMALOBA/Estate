// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-project-9f96b.firebaseapp.com",
  projectId: "mern-project-9f96b",
  storageBucket: "mern-project-9f96b.appspot.com",
  messagingSenderId: "900590110178",
  appId: "1:900590110178:web:29a0f1dedf6dcc99bde5bb"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);