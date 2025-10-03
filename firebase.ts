import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCO7cG5jzhMi4No7nLeycdeeujwiLUKrSg",
  authDomain: "studysesh-be131.firebaseapp.com",
  projectId: "studysesh-be131",
  storageBucket: "studysesh-be131.firebasestorage.app",
  messagingSenderId: "731936518166",
  appId: "1:731936518166:web:441d18ab54d4a424b30537",
  measurementId: "G-9HMWSWQE67",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
