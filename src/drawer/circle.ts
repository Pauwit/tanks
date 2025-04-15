import {Shape} from "./shape";

export class Circle extends Shape {
    private _radius: number;

    public constructor(x: number, y: number, radius: number) {
        super(x, y, 0);
        this._radius = radius;
    }

    public get radius(): number {
        return this._radius;
    }

    public resize(dr: number): void {
        if (this.radius + dr <= 0) {
            console.error("[Circle] ERR : radius cannot be negative.");
            throw new Error("[Circle] ERR : radius cannot be negative.");
        } else
            this._radius += dr;
    }

    public override draw(ctx: CanvasRenderingContext2D, color: string = "#000"): void {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }
}
