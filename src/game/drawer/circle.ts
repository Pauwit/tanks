import {Shape} from "./shape.ts";

export class Circle extends Shape {
    private _radius: number;

    public constructor(x: number, y: number, radius: number, color: string = "#fff") {
        super(x, y, 0, color);
        this._radius = radius;
    }

    public get radius(): number {
        return this._radius;
    }

    public resize(dr: number): void {
        if (this.radius + dr <= 0) {
            console.error("[ERR] Circle - radius cannot be negative.");
            throw new Error("[ERR] Circle - radius cannot be negative.");
        } else
            this._radius += dr;
    }

    public override draw(ctx: CanvasRenderingContext2D, color: string = this.color): void {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }
}
