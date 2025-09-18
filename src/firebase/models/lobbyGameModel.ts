import type {GamePlayerModel} from "./gamePlayerModel.ts";
import type {GameBulletModel} from "./gameBulletModel.ts";
import type {GameMineModel} from "./gameMineModel.ts";
import type {GameExplosionModel} from "./gameExplosionModel.ts";

export type LobbyGameModel = {
    players: Record<string, GamePlayerModel>;
    bullets: Record<string, GameBulletModel>;
    mines: Record<string, GameMineModel>;
    explosions: Record<string, GameExplosionModel>;
}
