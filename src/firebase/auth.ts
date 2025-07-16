import { signInAnonymously } from 'firebase/auth';
import {Firebase} from "./firebase.ts";
import {showError} from "../ui/components/ErrorContext/errorStore.ts";

export async function authenticate() {
    // Sign in anonymously (or use another method)
    await signInAnonymously(Firebase.auth)
        .then(() => {
            console.log("[LOG] auth - Signed in anonymously");
        })
        .catch((error) => {
            console.error("[ERR] auth - Auth error:", error);
            showError("Auth error :", error);
        });

}


