import {Circle} from "../drawer/circle.ts";
import {Constants} from "../misc/constants.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {BombStats} from "./bombStats.ts";

export class Bomb implements IUpdatable, IDrawable {
    private _circle: Circle;
    private _stats: BombStats;

    private readonly _ownerId: string;

    private _time: number;

    constructor(ownerId: string, x: number, y: number, bombStats: BombStats = Constants.defaultBombStats) {
        this._circle = new Circle(x, y, Constants.bombRadius, Constants.bombColor);
        this._ownerId = ownerId;
        this._time = 0;
        this._stats = bombStats;
    }

    get circle(): Circle {
        return this._circle;
    }

    get ownerId(): string {
        return this._ownerId;
    }

    update(deltaTime: number): boolean {
        // Add time
        this._time += deltaTime;
        return this._time < this._stats.tickTime;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._circle.draw(ctx);

        // Draw little red circle and play bip noise
        // TODO
    }
}