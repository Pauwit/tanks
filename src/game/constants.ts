import type {TankStats} from "./tank/tankStats.ts";
import type {BulletStats} from "./bullet/bulletStats.ts";
import type {BombStats} from "./bomb/bombStats.ts";
import type {ExplosionStats} from "./explosion/explosionStats.ts";
import type {Map} from "./map/map.ts";
import {Point} from "./drawer/point.ts";
import {BlockType} from "./map/blockType.ts";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Constants {
    export const defaultTankStats: TankStats = {moveSpeed: 300, rotationSpeed: 250, maxBullets: 5, maxBombs: 2};
    export const defaultBulletStats: BulletStats = {moveSpeed: 400, maxBounces: 1};
    export const defaultExplosionStats: ExplosionStats = {explosionSize: 130, explosionDuration: 5, explosionExpansionTime: 1.2};
    export const defaultBombStats: BombStats = {tickTime: 6, explosionStats: defaultExplosionStats};

    export const tankBaseWidth: number = 55;
    export const tankBaseHeight: number = 40;
    export const tankTurretSize: number = 22;
    export const tankTurretCannonWidth: number = 30;
    export const tankTurretCannonHeight: number = 8;

    export const playerTankBaseColor = "#004d86";
    export const playerTankTurretColor = "#0088c0";

    export const moveAngleThreshold: number = 3;

    export const bulletWidth: number = 12;
    export const bulletHeight: number = 5;
    export const bulletSpawnDistance: number = 50;

    export const bombRadius: number = 10;
    export const bombColor: string = "#ff0";
    export const bombMiddleColor: string = "#f00";
    export const bombMiddleRadius: number = 7;
    export const bombMiddleDuration: number = 0.07;

    export const explosionStartRadius: number = 10;
    export const explosionColor: string = "#fa0";
    export const explosionDecrease: number = 5;

    export const mapWidth: number = 20;
    export const mapHeight: number = 10;

    export const emptyMap: Map = {
        name: "Empty Map",
        description: "Empty Map for testing",
        spawns: [new Point(100, 100)],
        blocks: new Array<BlockType>(mapHeight)
            .fill(BlockType.None)
            .map(() => new Array(mapWidth).fill(BlockType.None)),
    };
}