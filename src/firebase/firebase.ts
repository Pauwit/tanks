import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {authenticate} from "./auth.ts";
import {Logger} from "../game/misc/logger.ts";

export class Firebase {
    private readonly _firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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