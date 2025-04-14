export abstract class Shape {
    private _x: number = 0;
    private _y: number = 0;
    private _rotation: number = 0;

    protected constructor(x: number, y: number, rotation: number) {
        this._x = x;
        this._y = y;
        this._rotation = rotation;
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

    public translate(dx: number, dy: number): void {
        this._x += dx;
        this._y += dy;
    }

    public rotate(dr: number): void {
        this._rotation = (this._rotation + dr) % 360;
    }

    // Abstract Functions

    public abstract draw(ctx: CanvasRenderingContext2D): void;
}