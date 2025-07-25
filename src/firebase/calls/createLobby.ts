import { ref, push, set } from "firebase/database";
import type {LobbyConfigModel} from "../models/lobbyConfigModel.ts";
import {LobbyStatus} from "../../game/enums/lobbyStatus.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";
import {Firebase} from "../firebase.ts";
import {showError} from "../../ui/components/ErrorContext/errorStore.ts";
import {Logger} from "../../game/misc/Logger.ts";

const DEFAULT_CONFIG: LobbyConfigModel = {
    gamemode: "classic",
    maxPlayers: 4,
    owner: "", // will be set to uid
    map: null, // define structure later if needed
};

export async function createLobby(name: string): Promise<string | null> {
    try {
        const lobbiesRef = ref(Firebase.db, "lobbies");

        // Create a new lobby key
        const newLobbyRef = push(lobbiesRef);

        const lobbyData: LobbyDataModel = {
            name,
            players: [{uid: Firebase.uid, name: Firebase.name}],
            status: LobbyStatus.Waiting,
            config: {
                ...DEFAULT_CONFIG,
                owner: Firebase.uid, // set owner
            },
        };

        await set(newLobbyRef, lobbyData);

        Logger.log("firebase", "Created lobby successfully :", newLobbyRef.key);
        return newLobbyRef.key as string;
    } catch (e) {
        showError("Error while creating lobby :", e);
        Logger.error("firebase", "Error while creating lobby :", e);
        return null;
    }
}
