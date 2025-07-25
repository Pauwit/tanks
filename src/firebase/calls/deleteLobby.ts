import { getDatabase, ref, remove } from "firebase/database";
import {Logger} from "../../game/misc/Logger.ts";

/**
 * Deletes a lobby by its ID from the Firebase Realtime Database.
 * @param lobbyId The ID of the lobby to delete.
 * @returns Promise that resolves when deletion is complete.
 */
export async function deleteLobby(lobbyId: string): Promise<void> {
    if (lobbyId === "") {
        return;
    }

    const db = getDatabase();
    const lobbyRef = ref(db, `lobbies/${lobbyId}`);

    try {
        await remove(lobbyRef);
        Logger.log("lobby", "Successfully deleted lobby:", lobbyId);
    } catch (error) {
        Logger.error("lobby", "Failed to delete lobby:", lobbyId, error);
        throw error;
    }
}
