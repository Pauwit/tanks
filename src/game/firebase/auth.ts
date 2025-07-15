import { signInAnonymously } from 'firebase/auth';
import {AUTH} from "./firebase.ts";

export async function authenticate() {
    // Sign in anonymously (or use another method)
    signInAnonymously(AUTH)
        .then(() => {
            console.log("[LOG] auth - Signed in anonymously");
        })
        .catch((error) => {
            console.error("Auth error:", error);
        });

}


