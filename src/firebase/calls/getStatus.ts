import {get, ref} from "firebase/database";
import {Firebase} from "../firebase.ts";
import {Logger} from "../../game/misc/Logger.ts";
import type {LobbyStatus} from "../../game/enums/lobbyStatus.ts";

export async function getStatus(id: string): Promise<LobbyStatus | null> {
    const lobbyStatusRef = ref(Firebase.db, `lobbies/${id}/status`);

    const snapshot = await get(lobbyStatusRef);
    if (!snapshot.exists()) {
        Logger.error("lobby", "Lobby does not exist with id :", id);
        return null;
    }

    return snapshot.val() as LobbyStatus;
}

