import {Circle} from "../drawer/circle.ts";
import {Constants} from "../constants.ts";
import {IUpdatable} from "../interfaces/IUpdatable.ts";
import {IDrawable} from "../interfaces/IDrawable.ts";
import {BombStats} from "./bombStats.ts";
import {ExplosionManager} from "../explosion/explosionManager.ts";
import {AudioManager} from "../misc/audioManager.ts";

export class Bomb implements IUpdatable, IDrawable {
    private readonly _circle: Circle;
    private _stats: BombStats;

    private readonly _ownerId: string;

    private _time: number;
    private _bip: boolean;
    private _redCircle: boolean;
    private _times: number[];

    public constructor(ownerId: string, x: number, y: number, bombStats: BombStats = Constants.defaultBombStats) {
        this._circle = new Circle(x, y, Constants.bombRadius, Constants.bombColor);
        this._ownerId = ownerId;
        this._time = 0;
        this._stats = bombStats;
        this._bip = false;
        this._redCircle = false;

        const tot = this._stats.tickTime;
        this._times = [0.05, 3*tot/4, 3*tot/4 + tot/16, 3*tot/4 + tot/8, 3*tot/4 + 3*tot/16];
    }

    public get circle(): Circle {
        return this._circle;
    }

    public get ownerId(): string {
        return this._ownerId;
    }

    public explode(): void {
        ExplosionManager.Instance.add(this.circle.x, this.circle.y, this._stats.explosionStats);
    }

    public update(deltaTime: number): boolean {
        const oldTime = this._time;
        this._time += deltaTime;

        for (const t of this._times) {
            if (oldTime < t && this._time >= t) {
                this._bip = true;
            }
            if (this._time >= t && this._time <= t + Constants.bombMiddleDuration) {
                this._redCircle = true;
                break;
            }
            else {
                this._redCircle = false;
            }
        }

        return this._time < this._stats.tickTime;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this._circle.draw(ctx);

        // Play bip noise
        if (this._bip) {
            AudioManager.playBombBip();
            this._bip = false;
        }

        // Draw little red circle
        if (this._redCircle) {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = Constants.bombMiddleColor;
            ctx.arc(this.circle.x, this.circle.y, Constants.bombMiddleRadius, 0, 2 * Math.PI);
            ctx.fill();

            ctx.closePath();
            ctx.restore();
        }
    }
}