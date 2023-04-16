import { initializeApp } from "firebase/app";
import {getFirestore}from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCmSpaDrRvLkk6l1HCLXbj8IOOmrO_P2To",
  authDomain: "react-final-project-90c8a.firebaseapp.com",
  databaseURL: "https://react-final-project-90c8a-default-rtdb.firebaseio.com",
  projectId: "react-final-project-90c8a",
  storageBucket: "react-final-project-90c8a.appspot.com",
  messagingSenderId: "91224886829",
  appId: "1:91224886829:web:76f99e0d49fb651c55f2a4",
  measurementId: "G-67GHSKGP5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default app
