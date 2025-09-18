import type {LobbyStatus} from "../../game/enums/lobbyStatus.ts";
import type {LobbyPlayerModel} from "./lobbyPlayerModel.ts";

export type LobbySummaryModel = {
    id: string;
    name: string;
    players: LobbyPlayerModel[];
    maxPlayers: number;
    status: LobbyStatus;
};