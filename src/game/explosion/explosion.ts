import type {IUpdatable} from "../interfaces/IUpdatable.ts";
import type {IDrawable} from "../interfaces/IDrawable.ts";
import {Circle} from "../drawer/circle.ts";
import type {ExplosionStats} from "./explosionStats.ts";
import {Constants} from "../constants.ts";
import {AudioManager} from "../misc/audioManager.ts";

export class Explosion implements IUpdatable, IDrawable {
    private readonly _circle: Circle;
    private _stats: ExplosionStats;

    private _time: number;

    constructor(x: number, y: number, explosionStats: ExplosionStats = Constants.defaultExplosionStats) {
        this._circle = new Circle(x, y, Constants.explosionStartRadius, Constants.explosionColor);

        this._stats = explosionStats;
        this._time = 0;

        // Play explosion sound
        AudioManager.playExplosion();
    }

    public get circle(): Circle {
        return this._circle;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const sub = this._stats.explosionDuration - this._time;
        if (sub < 1) {
            ctx.globalAlpha = sub;
        }
        this._circle.draw(ctx);
        ctx.restore();
    }

    update(deltaTime: number): boolean {
        if (this._time < this._stats.explosionExpansionTime) {
            const inc = (this._stats.explosionSize - Constants.explosionStartRadius) / this._stats.explosionExpansionTime;
            this._circle.resize(inc * deltaTime);
        } else {
            this._circle.resize(-Constants.explosionDecrease * deltaTime);
        }

        this._time += deltaTime;
        return this._time < this._stats.explosionDuration;
    }

}