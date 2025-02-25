// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "nizcaretm.firebaseapp.com",
  projectId: "nizcaretm",
  storageBucket: "nizcaretm.appspot.com",
  messagingSenderId: "517073966928",
  appId: "1:517073966928:web:1fcdf800dd0f06bd5e7e55"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);