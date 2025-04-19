import {TankStats} from "../tank/tankStats.ts";

export namespace Constants {
    export const defaultTankStats: TankStats = {moveSpeed: 30, rotationSpeed: 3};

    export const defaultTankBaseWidth: number = 100;
    export const defaultTankBaseHeight: number = 30;
    export const defaultTankTurretSize: number = 10;
}