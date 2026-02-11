import {set, ref} from "firebase/database";
import {Firebase} from "../firebase.ts";
import {showError} from "../../ui/components/ErrorContext/errorStore.ts";
import {Logger} from "../../game/misc/logger.ts";

export async function setName(name: string): Promise<boolean> {
    if (name === "") {
        return false;
    }

    const nameRef = ref(Firebase.db, `users/${Firebase.uid}`);

    try {
        await set(nameRef, name);
        Logger.log("firebase", "Successfully changed name to :", name);
    } catch (e) {
        showError("Could not set name :", e);
        Logger.error("firebase", "Could not set name :", e);
        return false;
    }

    return true;
}

