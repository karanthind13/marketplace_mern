// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "marketplace-mern-dfdcd.firebaseapp.com",
  projectId: "marketplace-mern-dfdcd",
  storageBucket: "marketplace-mern-dfdcd.firebasestorage.app",
  messagingSenderId: "762851428560",
  appId: "1:762851428560:web:82f6ccc21a5621bf52f6d5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);