import type {LobbyConfigModel} from "./lobbyConfigModel.ts";
import type {LobbyStatus} from "../../game/enums/lobbyStatus.ts";
import type {LobbyPlayerModel} from "./lobbyPlayerModel.ts";
import type {LobbyGameModel} from "./lobbyGameModel.ts";

export type LobbyDataModel = {
    name: string;
    players: LobbyPlayerModel[];
    status: LobbyStatus;
    config: LobbyConfigModel;
    game?: LobbyGameModel;
}
