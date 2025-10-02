import {Firebase} from "../firebase.ts";
import {ref, onChildChanged, type Unsubscribe} from "firebase/database";

export function listenToChildChange(path: string, onChange: (uid: string, data: any) => void): Unsubscribe {
    const reference = ref(Firebase.db, path);

    return onChildChanged(reference, (snapshot) => {
        const uid = snapshot.key!;
        onChange(uid, snapshot.val());
    });
}