import { signInAnonymously } from 'firebase/auth';
import {Firebase} from "./firebase.ts";
import {showError} from "../ui/components/ErrorContext/errorStore.ts";
import {Logger} from "../game/misc/Logger.ts";

export async function authenticate() {
    // Sign in anonymously (or use another method)
    await signInAnonymously(Firebase.auth)
        .then(() => {
            Logger.log("auth", "Signed in anonymously");
        })
        .catch((error) => {
            Logger.error("auth", "Auth error:", error);
            showError("Auth error :", error);
        });

}


