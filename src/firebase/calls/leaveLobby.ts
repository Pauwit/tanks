import { ref, update } from "firebase/database";
import {Firebase} from "../firebase.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";
import type {LobbyPlayerModel} from "../models/lobbyPlayerModel.ts";

export async function leaveLobby(lobby: LobbyDataModel, lobbyId: string): Promise<boolean> {
    if (lobby === null) {
        console.error("[ERR] lobby - Lobby does not exist");
        return false;
    }

    const updatedPlayers: LobbyPlayerModel[] = [];
    let found: boolean = false;
    for (const player of lobby.players) {
        if (player.uid !== Firebase.uid) {
            updatedPlayers.push(player);
            found = true;
        }
    }

    if (!found) {
        console.warn("[WAR] lobby - Player is not in this lobby");
        return true;
    }

    const lobbyRef = ref(Firebase.db, `lobbies/${lobbyId}`);

    try {
        await update(lobbyRef, {players: updatedPlayers});
        console.log("[LOG] lobby - Left lobby successfully");
        return true;
    } catch (error) {
        console.error("[ERR] lobby - Failed to leave lobby :", error);
        return false;
    }
}
