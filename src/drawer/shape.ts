import {Point} from "./point.ts";
import {mod} from "../misc/misc.ts";

export abstract class Shape {
    private _x: number;
    private _y: number;
    private _rotation: number;
    private _color: string;

    protected constructor(x: number, y: number, rotation: number, color: string) {
        rotation = mod(rotation, 360);

        this._x = x;
        this._y = y;
        this._rotation = rotation;
        this._color = color;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get rotation(): number {
        return this._rotation;
    }

    public get color(): string {
        return this._color;
    }

    public get position(): Point {
        return new Point(this.x, this.y);
    }

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }

    public set rotation(value: number) {
        this._rotation = mod(value, 360);
    }

    public set color(value: string) {
        this._color = value;
    }

    public translate(dx: number, dy: number): void {
        this._x += dx;
        this._y += dy;
    }

    public translate_point(p: Point): void {
        this._x += p.x;
        this._y += p.y;
    }

    public rotate(dr: number): void {
        this._rotation = mod(this._rotation + dr, 360);
    }

    // Abstract Functions

    public abstract draw(ctx: CanvasRenderingContext2D): void;
}