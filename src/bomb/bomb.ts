import {Circle} from "../drawer/circle.ts";
import {Constants} from "../misc/constants.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {IDrawable} from "../misc/IDrawable.ts";

export class Bomb implements IUpdatable, IDrawable {
    private _circle: Circle;

    private _ownerId: string;

    private _time: number;

    constructor(ownerId: string, x: number, y: number) {
        this._circle = new Circle(x, y, Constants.bombRadius, Constants.bombColor);
        this._ownerId = ownerId;
        this._time = 0;
    }

    get circle(): Circle {
        return this._circle;
    }

    get ownerId(): string {
        return this._ownerId;
    }

    update(deltaTime: number): boolean {

    }

    draw(ctx: CanvasRenderingContext2D): void {

    }
}