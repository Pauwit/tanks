import {Shape} from "./shape";
import {degToRad} from "../misc/misc.ts";

export class Rectangle extends Shape {
    private _width: number;
    private _height: number;

    public constructor(x: number, y: number, width: number, height: number, rotation: number = 0, color: string = "#fff") {
        super(x, y, rotation, color);
        this._width = width;
        this._height = height;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public resize(dw: number, dh: number): void {
        if (this._width + dw <= 0) {
            console.error("[ERR] Rectangle - width cannot be negative.");
            throw new Error("[ERR] Rectangle - width cannot be negative.");
        } else
            this._width += dw;

        if (this._height + dh <= 0) {
            console.error("[ERR] Rectangle - height cannot be negative.");
            throw new Error("[ERR] Rectangle - height cannot be negative.");
        } else
            this._height += dh;
    }

    public override draw(ctx: CanvasRenderingContext2D, color: string = this.color): void {
        ctx.save();
        ctx.beginPath();

        ctx.translate(this.x, this.y);
        ctx.rotate(degToRad(this.rotation));
        ctx.fillStyle = color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.closePath();
        ctx.restore();
    }
}
