import { ref, get, set } from "firebase/database";
import {Firebase} from "../firebase.ts";
import {Logger} from "../../game/misc/Logger.ts";
import {Constants} from "../../game/constants.ts";

export async function registerPlayerToGame(lobbyId: string): Promise<boolean> {
    const playerRef = ref(Firebase.db, `lobbies/${lobbyId}/game/players/${Firebase.uid}`);
    const gameRef = ref(Firebase.db, `lobbies/${lobbyId}/game`);

    try {
        const snapshot = await get(gameRef);

        // Check if game has been initialized
        if (!snapshot.exists()) {
            Logger.error("game", "Game has not been initialized yet");
            return false;
        }

        // Check if player is already registered
        const existingPlayer = await get(playerRef);
        if (existingPlayer.exists()) {
            Logger.warn("game", `Player ${Firebase.uid} is already registered in the game`);
            return true;
        }

        await set(playerRef, Constants.defaultPlayer);

        Logger.log("game", `Player ${Firebase.uid} registered to the game successfully`);
        return true;
    } catch (error) {
        Logger.error("game", "Failed to register player to the game :", error);
        return false;
    }
}
