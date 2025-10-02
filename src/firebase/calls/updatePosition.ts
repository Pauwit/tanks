import {ref, update} from "firebase/database";
import {Firebase} from "../firebase.ts";

export async function updatePosition(lobbyId: string, uid: string, x: number, y: number, rotation: number, look: number) {
    const posRef = ref(Firebase.db, `lobbies/${lobbyId}/game/players/${uid}/`);
    await update(posRef, {
        position: {
            x: x,
            y: y
        },
        rotation: rotation,
        look: look
    });
}