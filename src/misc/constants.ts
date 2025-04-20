import {TankStats} from "../tank/tankStats.ts";

export namespace Constants {
    export const defaultTankStats: TankStats = {moveSpeed: 300, rotationSpeed: 140};

    export const defaultTankBaseWidth: number = 55;
    export const defaultTankBaseHeight: number = 40;
    export const defaultTankTurretSize: number = 22;
    export const defaultTankTurretCannonWidth: number = 30;
    export const defaultTankTurretCannonHeight: number = 8;

    export const moveAngleThreshold: number = 3;
}