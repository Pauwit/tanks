import {Circle} from "../drawer/circle.ts";
import {Constants} from "../constants.ts";
import {IUpdatable} from "../interfaces/IUpdatable.ts";
import {IDrawable} from "../interfaces/IDrawable.ts";
import {BombStats} from "./bombStats.ts";
import {ExplosionManager} from "../explosion/explosionManager.ts";

export class Bomb implements IUpdatable, IDrawable {
    private readonly _circle: Circle;
    private _stats: BombStats;

    private readonly _ownerId: string;

    private _time: number;

    public constructor(ownerId: string, x: number, y: number, bombStats: BombStats = Constants.defaultBombStats) {
        this._circle = new Circle(x, y, Constants.bombRadius, Constants.bombColor);
        this._ownerId = ownerId;
        this._time = 0;
        this._stats = bombStats;
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
        // Add time
        this._time += deltaTime;
        return this._time < this._stats.tickTime;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this._circle.draw(ctx);

        // Draw little red circle and play bip noise
        // TODO
    }
}