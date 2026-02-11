import {Logger} from "../misc/logger.ts";

export class Window {
    private readonly LOGICAL_WIDTH = 3840;
    private readonly LOGICAL_HEIGHT = 2160;
    private readonly ASPECT_RATIO = this.LOGICAL_WIDTH / this.LOGICAL_HEIGHT;

    private static _instance: Window;

    public static SetInstance(canvas: HTMLCanvasElement, deltaDisplay : HTMLElement, fpsRenderDisplay : HTMLElement, fpsUpdateDisplay : HTMLElement): void {
        this._instance = new Window(canvas, deltaDisplay, fpsRenderDisplay, fpsUpdateDisplay);
    }

    public static get Instance(): Window {
        return this._instance;
    }

    private readonly _canvas : HTMLCanvasElement;
    private readonly _ctx : CanvasRenderingContext2D;
    private _windowWidth : number;
    private _windowHeight : number;
    private readonly _deltaDisplay : HTMLElement;
    private readonly _fpsRenderDisplay : HTMLElement;
    private readonly _fpsUpdateDisplay : HTMLElement;
    private _scale = {x: 1, y: 1};

    private constructor(canvas: HTMLCanvasElement, deltaDisplay : HTMLElement, fpsRenderDisplay : HTMLElement, fpsUpdateDisplay : HTMLElement) {
        this._canvas = canvas;
        this._ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
        this._windowWidth = canvas.width;
        this._windowHeight = canvas.height;

        this._deltaDisplay = deltaDisplay;
        this._fpsRenderDisplay = fpsRenderDisplay;
        this._fpsUpdateDisplay = fpsUpdateDisplay;

        document.body.style.overflow = "hidden";
        this.handleResize(canvas);
        window.addEventListener('resize', () => Window.Instance.handleResize(canvas));

        // Prevent right click and tab
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.addEventListener('keydown', (event) => {
            if (event.code === "Tab") {
                event.preventDefault();
            }
        });
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

    get fpsRenderDisplay(): HTMLElement {
        return this._fpsRenderDisplay;
    }

    get fpsUpdateDisplay(): HTMLElement {
        return this._fpsUpdateDisplay;
    }

    get scaleX(): number {
        return this._scale.x;
    }

    get scaleY(): number {
        return this._scale.y;
    }

    public handleResize(canvas: HTMLCanvasElement) {
        const parent = canvas.parentElement!;
        const maxWidth = parent.clientWidth;
        const maxHeight = parent.clientHeight;

        let newWidth = maxWidth - 2;
        let newHeight = newWidth / this.ASPECT_RATIO;

        if (newHeight > maxHeight) {
            newHeight = maxHeight - 2;
            newWidth = newHeight * this.ASPECT_RATIO;
        }

        // Set physical size for rendering
        canvas.width = this.LOGICAL_WIDTH;
        canvas.height = this.LOGICAL_HEIGHT;

        // Set displayed size via CSS
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;

        // Scale the drawing context to map logical -> actual
        this._ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any existing transform
        this._ctx.scale(newWidth / this.LOGICAL_WIDTH, newHeight / this.LOGICAL_HEIGHT);
        this._scale.x = newWidth / this.LOGICAL_WIDTH;
        this._scale.y = newHeight / this.LOGICAL_HEIGHT;

        Logger.warn("Window", "Resize to :", newWidth, newHeight);

        this._windowWidth = this.LOGICAL_WIDTH;
        this._windowHeight = this.LOGICAL_HEIGHT;
    }

    public clear() : void {
        this._ctx.reset();
        this._ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    }

    public setDeltaDisplay(delta : number) {
        this.deltaDisplay.textContent = Math.round(delta * 100) / 100 + ' ms';
    }

    public setFPSRenderDisplay(fps : number) {
        this.fpsRenderDisplay.textContent = 'R ' + Math.round(fps) + ' FPS';
    }

    public setFPSUpdateDisplay(fps : number) {
        this.fpsUpdateDisplay.textContent = 'U ' + Math.round(fps) + ' FPS';
    }

    public outOfBounds(x: number, y: number) {
        return x < 0 || y < 0 || x >= this._windowWidth || y >= this._windowHeight;
    }

    public changeCursor(visible: boolean) {
        if (visible) {
            this._canvas.style.cursor = 'auto';
        } else {
            this._canvas.style.cursor = 'none';
        }
    }

}