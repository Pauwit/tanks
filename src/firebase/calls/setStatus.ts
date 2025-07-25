import {ref, update} from "firebase/database";
import {Firebase} from "../firebase.ts";
import {LobbyStatus} from "../../game/enums/lobbyStatus.ts";
import {Logger} from "../../game/misc/Logger.ts";

export async function setStatus(lobbyId: string, status: LobbyStatus): Promise<void> {
    if (status === LobbyStatus.Error) {
        return;
    }

    const lobbyRef = ref(Firebase.db, `lobbies/${lobbyId}`);

    try {
        await update(lobbyRef, {status: status});
        Logger.log("firebase", "Successfully changed status to :", status);
    } catch (e) {
        Logger.error("firebase", "Could not change status :", e);
    }
}

