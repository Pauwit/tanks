import {IUpdatable} from "../misc/IUpdatable.ts";
import {TankStats} from "./tankStats.ts";
import {Constants} from "../misc/constants.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {degToPoint} from "../misc/misc.ts";

export class Tank implements IUpdatable, IDrawable {
    private _base: Rectangle;
    private _turret: Rectangle;

    private _tankStats: TankStats;

    private _baseDesiredRotation: number;
    private _moving: boolean;


    constructor(x: number = 0, y: number = 0, turretRotation: number = 0, baseRotation: number = 0,
                tankStats: TankStats = Constants.defaultTankStats) {

        this._base = new Rectangle(x, y, Constants.defaultTankBaseWidth, Constants.defaultTankBaseHeight, baseRotation);
        this._turret = new Rectangle(x, y, Constants.defaultTankTurretSize, Constants.defaultTankTurretSize, baseRotation);

        this._tankStats = tankStats;
        this._baseDesiredRotation = baseRotation % 360;
        this._moving = false;
    }

    update(): void {
        if (this._baseDesiredRotation != this._base.rotation) {
            // TODO
        }

        if (this._moving && this._baseDesiredRotation == this._base.rotation) {
            const direction = degToPoint(this._base.rotation);
            this._base.translate_point(direction);
            this._turret.translate_point(direction);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {

    }


}