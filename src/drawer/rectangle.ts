import {Shape} from "./shape";

export class Rectangle extends Shape {
    private _width: number;
    private _height: number;

    public constructor(x: number, y: number, width: number, height: number, rotation: number = 0) {
        super(x, y, rotation);
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
            console.error("[Rectangle] ERR : width cannot be negative.");
            throw new Error("[Rectangle] ERR : width cannot be negative.");
        } else
            this._width += dw;

        if (this._height + dh <= 0) {
            console.error("[Rectangle] ERR : height cannot be negative.");
            throw new Error("[Rectangle] ERR : height cannot be negative.");
        } else
            this._height += dh;
    }

    public override draw(ctx: CanvasRenderingContext2D, color: string = "#000"): void {
        ctx.save();
        ctx.beginPath();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.closePath();
        ctx.restore();
    }
}
