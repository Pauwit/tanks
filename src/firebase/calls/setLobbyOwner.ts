import {ref, update} from "firebase/database";
import {Firebase} from "../firebase.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";
import {Logger} from "../../game/misc/Logger.ts";

export async function setLobbyOwner(lobbyId: string, lobby: LobbyDataModel, uid: string): Promise<void> {
    if (lobbyId === "" || uid === "") {
        return;
    }

    if(!lobby.players.some((val) => val.uid === uid)) {
        Logger.error("firebase", "Cannot change owner because the uid is not in the player list :", uid);
        return;
    }

    const lobbyConfigRef = ref(Firebase.db, `lobbies/${lobbyId}/config`);

    try {
        await update(lobbyConfigRef, {owner: uid});
        Logger.log("firebase", "Successfully changed owner to :", uid);
    } catch (e) {
        Logger.error("firebase", "Could not set new owner :", e);
    }
}

