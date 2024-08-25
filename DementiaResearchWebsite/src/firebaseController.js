// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
require('dotenv').config();
const apiKey = process.env.FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "dementiaresearchwebsite.firebaseapp.com",
  projectId: "dementiaresearchwebsite",
  storageBucket: "dementiaresearchwebsite.appspot.com",
  messagingSenderId: "317100823817",
  appId: "1:317100823817:web:e03f8d0d4eb0b3fe01efd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);