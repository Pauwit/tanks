// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {authenticate} from "./auth.ts";

// T ODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export class Firebase {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    private readonly _firebaseConfig = {
        apiKey: "AIzaSyDi21KsNnjr71Tff8BV9riXcJKt_DHJia4",
        authDomain: "tanks-bf67b.firebaseapp.com",
        databaseURL: "https://tanks-bf67b-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "tanks-bf67b",
        storageBucket: "tanks-bf67b.firebasestorage.app",
        messagingSenderId: "882607534193",
        appId: "1:882607534193:web:a0cd040d87e6c469142bd0",
        measurementId: "G-L79P1VMSPP"
    };

    private static Instance: Firebase;

    private readonly APP;
    private readonly DB;
    private readonly AUTH;

    private _uid: string = "";
    private _name: string = "";

    private constructor() {
        console.log("[LOG] firebase - Connecting to firebase...");

        // Initialize Firebase
        this.APP = initializeApp(this._firebaseConfig);
        console.log("[LOG] firebase - Returned app :", this.APP);

        // Get a reference to the Realtime Database service
        this.DB = getDatabase(this.APP);
        console.log("[LOG] firebase - Returned database :", this.DB);

        // Get authentication service
        this.AUTH = getAuth(this.APP);
        console.log("[LOG] firebase - Returned auth :", this.AUTH);

        onAuthStateChanged(this.AUTH, (user) => {
            if (user) {
                this._uid = user.uid;
                console.log("[LOG] firebase - User ID:", this._uid);
            }
        });

        Firebase.Instance = this;

    }

    public static async connectToFirebase() {
        new Firebase();
        await authenticate();
    }

    public static get app() {
        return Firebase.Instance.APP;
    }

    public static get db() {
        return Firebase.Instance.DB;
    }

    public static get auth() {
        return Firebase.Instance.AUTH;
    }

    public static get uid(): string {
        return Firebase.Instance._uid;
    }

    public static get name(): string {
        return Firebase.Instance._name;
    }

    public static set name(name: string) {
        Firebase.Instance._name = name;
    }
}