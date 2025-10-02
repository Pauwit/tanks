import {get, ref} from "firebase/database";
import {Firebase} from "../firebase.ts";

export async function TestExistence(path: string) {
    const reference = ref(Firebase.db, path);

    try {
        const snapshot = await get(reference);
        return snapshot.exists();
    }
    catch (e) {
        return false;
    }
}