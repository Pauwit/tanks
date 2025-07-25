import { ref, update } from "firebase/database";
import {Firebase} from "../firebase.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";
import type {LobbyPlayerModel} from "../models/lobbyPlayerModel.ts";
import {Logger} from "../../game/misc/Logger.ts";

export async function leaveLobby(lobby: LobbyDataModel, lobbyId: string): Promise<boolean> {
    if (lobby === null) {
        Logger.error("lobby", "Lobby does not exist");
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
        Logger.warn("lobby", "Player is not in this lobby");
        return true;
    }

    const lobbyRef = ref(Firebase.db, `lobbies/${lobbyId}`);

    try {
        await update(lobbyRef, {players: updatedPlayers});
        Logger.log("lobby", "Left lobby successfully");
        return true;
    } catch (error) {
        Logger.error("lobby", "Failed to leave lobby :", error);
        return false;
    }
}
