import {get, ref} from "firebase/database";
import {DB} from "../firebase.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";

export async function getLobby(id: string): Promise<LobbyDataModel | null> {
    const lobbyRef = ref(DB, `lobbies/${id}`);

    const snapshot = await get(lobbyRef);
    if (!snapshot.exists()) return null;

    return snapshot.val() as LobbyDataModel;
}

