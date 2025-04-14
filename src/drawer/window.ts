export class Window {
    private static _instance: Window;

    public static SetInstance(canvas: HTMLCanvasElement, deltaDisplay : HTMLElement, fpsDisplay : HTMLElement): void {
        this._instance = new Window(canvas, deltaDisplay, fpsDisplay);
    }

    public static get Instance(): Window {
        return this._instance;
    }

    private readonly _canvas : HTMLCanvasElement;
    private readonly _ctx : CanvasRenderingContext2D;
    private _windowWidth : number;
    private _windowHeight : number;
    private readonly _deltaDisplay : HTMLElement;
    private readonly _fpsDisplay : HTMLElement;

    private constructor(canvas: HTMLCanvasElement, deltaDisplay : HTMLElement, fpsDisplay : HTMLElement) {
        this._canvas = canvas;
        this._ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
        this._windowWidth = canvas.width;
        this._windowHeight = canvas.height;

        this._deltaDisplay = deltaDisplay;
        this._fpsDisplay = fpsDisplay;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    get windowWidth(): number {
        return this._windowWidth;
    }

    get windowHeight(): number {
        return this._windowHeight;
    }

    get deltaDisplay(): HTMLElement {
        return this._deltaDisplay;
    }

    get fpsDisplay(): HTMLElement {
        return this._fpsDisplay;
    }

    public resizeWindow(width : number, height : number) {
        if (width <= 0) {
            console.error("[Window] ERR : width cannot be negative.");
            throw new Error("[Window] ERR : width cannot be negative.");
        }
        if (height <= 0) {
            console.error("[Window] ERR : height cannot be negative.");
            throw new Error("[Window] ERR : height cannot be negative.");
        }

        this._windowWidth = width;
        this._windowHeight = height;
    }

    public clear() : void {
        this._ctx.reset();
        this._ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    }

    public setDeltaDisplay(delta : number) {
        this.deltaDisplay.textContent = Math.round(delta * 100) / 100 + ' ms';
    }

    public setFPSDisplay(fps : number) {
        this.fpsDisplay.textContent = Math.round(fps) + ' FPS';
    }

}