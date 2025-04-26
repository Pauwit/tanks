import {TankStats} from "../tank/tankStats.ts";
import {BulletStats} from "../bullet/bulletStats.ts";

export namespace Constants {
    export const defaultTankStats: TankStats = {moveSpeed: 300, rotationSpeed: 140, maxBullets: 5};
    export const defaultBulletStats: BulletStats = {moveSpeed: 400, maxBounces: 1};

    export const tankBaseWidth: number = 55;
    export const tankBaseHeight: number = 40;
    export const tankTurretSize: number = 22;
    export const tankTurretCannonWidth: number = 30;
    export const tankTurretCannonHeight: number = 8;

    export const moveAngleThreshold: number = 3;

    export const bulletWidth: number = 12;
    export const bulletHeight: number = 5;
    export const bulletSpawnDistance: number = 50;

    export const bombRadius: number = 10;
    export const bombColor: string = "#ff0";
}