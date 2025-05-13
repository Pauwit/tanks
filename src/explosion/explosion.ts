import {IUpdatable} from "../interfaces/IUpdatable.ts";
import {IDrawable} from "../interfaces/IDrawable.ts";
import {Circle} from "../drawer/circle.ts";
import {ExplosionStats} from "./explosionStats.ts";
import {Constants} from "../constants.ts";

export class Explosion implements IUpdatable, IDrawable {
    private readonly _circle: Circle;
    private _stats: ExplosionStats;

    private _time: number;

    constructor(x: number, y: number, explosionStats: ExplosionStats = Constants.defaultExplosionStats) {
        this._circle = new Circle(x, y, Constants.explosionStartRadius, Constants.explosionColor);

        this._stats = explosionStats;
        this._time = 0;
    }

    public get circle(): Circle {
        return this._circle;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._circle.draw(ctx);
    }

    update(deltaTime: number): boolean {
        const inc = (this._stats.explosionSize - Constants.explosionStartRadius) / this._stats.explosionDuration;
        this._circle.resize(inc * deltaTime);

        this._time += deltaTime;
        return this._time < this._stats.explosionDuration;
    }

}