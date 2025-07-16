import { ref, update } from "firebase/database";
import {Firebase} from "../firebase.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";

export async function joinLobby(lobby: LobbyDataModel, lobbyId: string): Promise<boolean> {
    if (lobby === null) {
        console.error("[ERR] lobby - Lobby does not exist");
        return false;
    }

    // Check if player is already in the lobby
    for (const player of lobby.players) {
        console.log(Firebase.uid, player.uid);
        if (player.uid === Firebase.uid) {
            console.log("[LOG] lobby - Player already in the lobby");
            return true;
        }
    }

    const lobbyRef = ref(Firebase.db, `lobbies/${lobbyId}`);

    // Add player to the list
    const updatedPlayers = [...(lobby.players || []), {
        uid: Firebase.uid,
        name: Firebase.name,
    }];

    try {
        await update(lobbyRef, {players: updatedPlayers});
        console.log("[LOG] lobby - Joined lobby successfully");
        return true;
    } catch (error) {
        console.error("[ERR] lobby - Failed to join lobby :", error);
        return false;
    }
}
