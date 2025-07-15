// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
export const APP = initializeApp(firebaseConfig);
console.log("[LOG] firebase - Returned app :", APP);

// Get a reference to the Realtime Database service
export const DB = getDatabase(APP);
console.log("[LOG] firebase - Returned database :", DB);

// Get authentication service
export const AUTH = getAuth(APP);


// Authenticate and get uid

export let UID: string = "";
// Get the UID when the user is signed in
onAuthStateChanged(AUTH, (user) => {
    if (user) {
        UID = user.uid;
        console.log("[LOG] firebase - User ID:", UID);
    }
});

import {getLobbies} from "./calls/getLobbies.ts";
import {authenticate} from "./auth.ts";
import {createLobby} from "./calls/createLobby.ts";
(async () => {
    await authenticate();
    // test
    //console.log(await getLobbies());
    //console.log(await createLobby("Test"))
})();