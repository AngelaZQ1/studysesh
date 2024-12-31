// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO7cG5jzhMi4No7nLeycdeeujwiLUKrSg",
  authDomain: "studysesh-be131.firebaseapp.com",
  projectId: "studysesh-be131",
  storageBucket: "studysesh-be131.firebasestorage.app",
  messagingSenderId: "731936518166",
  appId: "1:731936518166:web:441d18ab54d4a424b30537",
  measurementId: "G-9HMWSWQE67",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
