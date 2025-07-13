// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDi21KsNnjr71Tff8BV9riXcJKt_DHJia4",
    authDomain: "tanks-bf67b.firebaseapp.com",
    databaseURL: "https://tanks-bf67b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tanks-bf67b",
    storageBucket: "tanks-bf67b.firebasestorage.app",
    messagingSenderId: "882607534193",
    appId: "1:882607534193:web:a0cd040d87e6c469142bd0",
    measurementId: "G-L79P1VMSPP"
};

console.log("[LOG] firebase - Connecting to firebase...");

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
const database = getDatabase(app);

console.log("[LOG] firebase - Returned app :", app);
console.log("[LOG] firebase - Returned database :", database);
