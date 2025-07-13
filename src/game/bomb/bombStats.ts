import type {ExplosionStats} from "../explosion/explosionStats.ts";

export interface BombStats {
    tickTime: number;
    explosionStats: ExplosionStats;
}