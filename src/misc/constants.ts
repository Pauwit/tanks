import {TankStats} from "../tank/tankStats.ts";
import {BulletStats} from "../bullet/bulletStats.ts";

export namespace Constants {
    export const defaultTankStats: TankStats = {moveSpeed: 300, rotationSpeed: 140};
    export const defaultBulletStats: BulletStats = {moveSpeed: 400, maxBounces: 1};

    export const defaultTankBaseWidth: number = 55;
    export const defaultTankBaseHeight: number = 40;
    export const defaultTankTurretSize: number = 22;
    export const defaultTankTurretCannonWidth: number = 30;
    export const defaultTankTurretCannonHeight: number = 8;

    export const moveAngleThreshold: number = 3;

    export const defaultBulletWidth: number = 12;
    export const defaultBulletHeight: number = 5;
    export const defaultBulletSpawnDistance: number = 50;
}