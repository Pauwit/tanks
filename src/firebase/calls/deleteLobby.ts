import { getDatabase, ref, remove } from "firebase/database";

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
        console.log(`[LOG] lobby - Successfully deleted lobby: ${lobbyId}`);
    } catch (error) {
        console.error(`[ERR] lobby - Failed to delete lobby: ${lobbyId}`, error);
        throw error;
    }
}
