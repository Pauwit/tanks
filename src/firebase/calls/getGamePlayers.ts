import {get, ref} from "firebase/database";
import {Firebase} from "../firebase.ts";
import {Logger} from "../../game/misc/Logger.ts";
import type {GamePlayerModel} from "../models/gamePlayerModel.ts";

export async function getGamePlayers(lobbyId: string): Promise<Record<string, GamePlayerModel>> {
    const gamePlayersRef = ref(Firebase.db, `lobbies/${lobbyId}/game/players`);

    const snapshot = await get(gamePlayersRef);
    if (!snapshot.exists()) {
        Logger.error("lobby", "Game players object does not exist in lobby :", lobbyId);
        return {};
    }

    return snapshot.val() as Record<string, GamePlayerModel>;
}

