import {get, ref} from "firebase/database";
import {DB} from "../firebase.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";
import type {LobbySummaryModel} from "../models/lobbySummaryModel.ts";
import {LobbyStatus} from "../../enums/lobbyStatus.ts";

export async function getLobbies(): Promise<LobbySummaryModel[]> {
    const lobbiesRef = ref(DB, "lobbies");

    const snapshot = await get(lobbiesRef);
    if (!snapshot.exists()) return [];

    const lobbiesData: Record<string, LobbyDataModel> = snapshot.val();

    const lobbyList: LobbySummaryModel[] = Object.entries(lobbiesData).map(
        ([id, lobby]) => ({
            id,
            name: lobby.name ?? "Error getting name",
            players: lobby.players ?? [],
            maxPlayers: lobby.config?.maxPlayers ?? 0,
            status: lobby.status ?? LobbyStatus.Error,
        })
    );

    return lobbyList;
}

