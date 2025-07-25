// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {authenticate} from "./auth.ts";
import {Logger} from "../game/misc/Logger.ts";

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

    public static readonly MIN_NAME_SIZE = 4;
    public static readonly MAX_NAME_SIZE = 16;
    public static readonly MIN_LOBBY_NAME_SIZE = 4;
    public static readonly MAX_LOBBY_NAME_SIZE = 32;

    private static Instance: Firebase;

    private readonly APP;
    private readonly DB;
    private readonly AUTH;

    private _uid: string = "";
    private _name: string = "";

    private constructor() {
        Logger.log("firebase", "Connecting to firebase...");

        // Initialize Firebase
        this.APP = initializeApp(this._firebaseConfig);
        Logger.log("firebase", "Returned app :", this.APP);

        // Get a reference to the Realtime Database service
        this.DB = getDatabase(this.APP);
        Logger.log("firebase", "Returned database :", this.DB);

        // Get authentication service
        this.AUTH = getAuth(this.APP);
        Logger.log("firebase", "Returned auth :", this.AUTH);

        onAuthStateChanged(this.AUTH, (user) => {
            if (user) {
                this._uid = user.uid;
                Logger.log("firebase", "User ID:", this._uid);
            }
        });

        Firebase.Instance = this;
        Logger.log("firebase", "Connected successfully");
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