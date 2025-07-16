import {get, ref} from "firebase/database";
import {Firebase} from "../firebase.ts";

export async function getName(uid: string): Promise<string | null> {
    if (uid === "") {
        return null;
    }

    const nameRef = ref(Firebase.db, `users/${uid}`);

    const snapshot = await get(nameRef);
    if (!snapshot.exists()) return null;

    return snapshot.val() as string;
}

