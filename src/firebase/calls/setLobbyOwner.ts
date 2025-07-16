import {set, ref, update} from "firebase/database";
import {Firebase} from "../firebase.ts";
import {showError} from "../../ui/components/ErrorContext/errorStore.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";

export async function setLobbyOwner(lobbyId: string, lobby: LobbyDataModel, uid: string): Promise<void> {
    if (lobbyId === "" || uid === "") {
        return;
    }

    if(!lobby.players.some((val) => val.uid === uid)) {
        console.error("[ERR] firebase - Cannot change owner because the uid is not in the player list :", uid);
        return;
    }

    const lobbyConfigRef = ref(Firebase.db, `lobbies/${lobbyId}/config`);

    const updatedConfig = {
        ...lobby.config,
        owner: uid,
    };

    try {
        await update(lobbyConfigRef, {owner: uid});
        console.log("[LOG] firebase - Successfully changed owner to :", uid);
    } catch (e) {
        console.error("[ERR] firebase - Could not set new owner :", e);
    }
}

