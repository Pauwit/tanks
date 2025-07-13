import {Window} from "../drawer/window.ts";
import {clamp} from "../misc/misc.ts";
import {Point} from "../drawer/point.ts";

export class Mouse {
    private static _instance: Mouse = new Mouse();

    private _x: number = 0;
    private _y: number = 0;
    private _clicked: boolean = false;
    private _maintained: boolean = false;

    private constructor() {
        document.addEventListener('mousemove', this.onMove);
        document.addEventListener('mouseup', this.onUp);
        document.addEventListener('mousedown', this.onDown);
    }

    public static get Instance(): Mouse {
        return this._instance;
    }

    private onMove(e: MouseEvent): void {
        Mouse.Instance._x = e.clientX - Window.Instance.canvas.getBoundingClientRect().left;
        Mouse.Instance._x = clamp(Mouse.Instance._x, 0, Window.Instance.windowWidth) / Window.Instance.scaleX;
        Mouse.Instance._y = e.clientY - Window.Instance.canvas.getBoundingClientRect().top;
        Mouse.Instance._y = clamp(Mouse.Instance._y, 0, Window.Instance.windowHeight) / Window.Instance.scaleY;
    }

    private onUp(e: MouseEvent): void {
        Mouse.Instance._maintained = false;
    }

    private onDown(e: MouseEvent): void {
        Mouse.Instance._clicked = true;
        Mouse.Instance._maintained = true;

        // left / right click test with e.button
    }

    public resetMouse(): void {
        this._clicked = false;
    }

    public get maintained(): boolean {
        return this._maintained;
    }

    public get clicked(): boolean {
        return this._clicked;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get position(): Point {
        return new Point(this.x, this.y);
    }
}