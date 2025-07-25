import { ref, update } from "firebase/database";
import {Firebase} from "../firebase.ts";
import {Logger} from "../../game/misc/Logger.ts";
import {getLobby} from "./getLobby.ts";

export async function joinLobby(lobbyId: string): Promise<boolean> {
    const lobby = await getLobby(lobbyId);
    if (!lobby) {
        Logger.error("lobby", "Failed to join lobby");
        return false;
    }

    // Check if player is already in the lobby
    for (const player of lobby.players) {
        if (player.uid === Firebase.uid) {
            Logger.log("lobby", "Player already in the lobby");
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
        Logger.log("lobby", "Joined lobby successfully");
        return true;
    } catch (error) {
        Logger.error("lobby", "Failed to join lobby :", error);
        return false;
    }
}
