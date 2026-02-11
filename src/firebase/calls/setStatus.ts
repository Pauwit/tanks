import {ref, update} from "firebase/database";
import {Firebase} from "../firebase.ts";
import {LobbyStatus} from "../../game/enums/lobbyStatus.ts";
import {Logger} from "../../game/misc/logger.ts";

export async function setStatus(lobbyId: string, status: LobbyStatus): Promise<boolean> {
    const lobbyRef = ref(Firebase.db, `lobbies/${lobbyId}`);

    try {
        await update(lobbyRef, {status: status});
        Logger.log("firebase", "Successfully changed status to :", status);
        return true;
    } catch (e) {
        Logger.error("firebase", "Could not change status :", e);
        return false;
    }
}

