import { ref, push, set } from "firebase/database";
import type {LobbyConfigModel} from "../models/lobbyConfigModel.ts";
import {DB, UID} from "../firebase.ts";
import {LobbyStatus} from "../../enums/lobbyStatus.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";

const DEFAULT_CONFIG: LobbyConfigModel = {
    gamemode: "classic",
    maxPlayers: 4,
    owner: "", // will be set to uid
    map: null, // define structure later if needed
};

export async function createLobby(name: string): Promise<string> {
    const lobbiesRef = ref(DB, "lobbies");

    // Create a new lobby key
    const newLobbyRef = push(lobbiesRef);

    const lobbyData: LobbyDataModel = {
        name,
        players: [{uid: UID, name: "sample"}],
        status: LobbyStatus.Waiting,
        config: {
            ...DEFAULT_CONFIG,
            owner: UID, // set owner
        },
    };

    await set(newLobbyRef, lobbyData);

    return newLobbyRef.key as string;
}
