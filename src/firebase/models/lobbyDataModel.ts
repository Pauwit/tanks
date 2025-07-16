import type {LobbyConfigModel} from "./lobbyConfigModel.ts";
import type {GamePlayerModel} from "./gamePlayerModel.ts";
import type {GameBulletModel} from "./gameBulletModel.ts";
import type {GameMineModel} from "./gameMineModel.ts";
import type {GameExplosionModel} from "./gameExplosionModel.ts";
import type {LobbyStatus} from "../../game/enums/lobbyStatus.ts";
import type {LobbyPlayerModel} from "./lobbyPlayerModel.ts";

export type LobbyDataModel = {
    name: string;
    players: LobbyPlayerModel[];
    status: LobbyStatus;
    config: LobbyConfigModel;
    game?: {
        players: Record<string, GamePlayerModel>;
        bullets: Record<string, GameBulletModel>;
        mines: Record<string, GameMineModel>;
        explosions: Record<string, GameExplosionModel>;
    };
}
