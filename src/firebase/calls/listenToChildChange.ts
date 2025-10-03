import {Firebase} from "../firebase.ts";
import {ref, onChildChanged, type Unsubscribe} from "firebase/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function listenToChildChange(path: string, onChange: (uid: string, param: string, data: any) => void): Unsubscribe {
    const reference = ref(Firebase.db, path);

    return onChildChanged(reference, (snapshot) => {
        const uid = snapshot.ref.parent!.key!;
        const param = snapshot.ref.key!;
        onChange(uid, param, snapshot.val());
    });
}