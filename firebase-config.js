// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUgaaqDT9NWIRzUeisR9fvJkqWXLJyat0",
  authDomain: "logipoosite.firebaseapp.com",
  projectId: "logipoosite",
  storageBucket: "logipoosite.firebasestorage.app",
  messagingSenderId: "1019244285454",
  appId: "1:1019244285454:web:5ade3f8adeeeaa1690765f",
  measurementId: "G-LKD1X54X2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);