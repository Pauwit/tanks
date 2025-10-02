import {Firebase} from "../firebase.ts";
import {ref, onChildChanged, type Unsubscribe} from "firebase/database";
import {Logger} from "../../game/misc/Logger.ts";

export function listenToChildChange(path: string, onChange: (uid: string, data: any) => void): Unsubscribe {
    const reference = ref(Firebase.db, path);

    return onChildChanged(reference, (snapshot) => {
        const uid = snapshot.key!;
        Logger.log(null, snapshot.key);
        Logger.log(null, snapshot);
        onChange(uid, snapshot.val());
    });
}