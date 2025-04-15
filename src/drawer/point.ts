export class Point {
    private _x: number = 0;
    private _y: number = 0;

    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    set x(value: number) {
        this._x = value;
    }

    set y(value: number) {
        this._y = value;
    }

    public get position(): Point {
        return new Point(this.x, this.y);
    }

    public translate(dx: number, dy: number): void {
        this._x += dx;
        this._y += dy;
    }

    public translate_point(p: Point): void {
        this._x += p.x;
        this._y += p.y;
    }

    public dot(p: Point): number {
        return this.x * p.x + this.y * p.y;
    }

    public normalize(): Point {
        const len = Math.hypot(this.x, this.y);
        return new Point(this.x / len, this.y / len);
    }

}
