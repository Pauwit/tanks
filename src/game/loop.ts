import {Mouse} from "./input/mouse.ts";
import {Keyboard} from "./input/keyboard.ts";
import {Window} from "./drawer/window.ts";
import {clamp} from "./misc/misc.ts";
import {Logger} from "./misc/Logger.ts";

export type UpdateFunctionType = (dt: number) => void;
export type RenderFunctionType = () => void;

export class GameLoop {
    // FPS settings

    private readonly DEFAULT_FPS = 60;
    private readonly MIN_FPS = 20;
    private readonly MAX_FPS = 240;
    // This has to change with the screen fps
    private targetFps: number = this.DEFAULT_FPS;

    // The time in seconds the fps and delta time display refreshes
    private readonly DISPLAY_REFRESH = 0.5;
    private _displayDTCounter: number = 0;
    private _displayFrameRenderCounter: number = 0;
    private _displayFrameUpdateCounter: number = 0;

    // Stores the animation frame ID for cleanup when stopping the loop
    private _lastRequestId?: number;
    // Controls the game loop state (running/stopped)
    private _isRunning: boolean = false;
    // Records the previous frame's time for delta calculations
    public _lastTimestamp: number = 0;
    // Time elapsed since last frame, used for time-based updates
    private _deltaTime: number = 0;
    // Tracks leftover time for fixed timestep updates
    private _accumulator: number = 0;
    // Records when the game started for total time tracking
    public _gameStartTime: number = 0;

    // Singleton Pattern

    private static instance: GameLoop;

    private constructor() {
    }

    public static get Instance(): GameLoop {
        if (!this.instance) {
            this.instance = new GameLoop();
        }
        return this.instance;
    }

    // Returns the total elapsed time since game start in milliseconds
    public get time(): number {
        return this._lastTimestamp - this._gameStartTime;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get fps(): number {
        return 1000 / this._deltaTime;
    }

    // Calculates the ideal time per frame (e.g., 16.67ms for 60 FPS)
    private get targetFrameTime(): number {
        return 1000 / this.targetFps;
    }

    // The maximum allowed delta time per frame (50ms at 20 FPS)
    private get maxDeltaTime(): number {
        return 1000 / this.MIN_FPS;
    }

    // Delta time represents how long it took to render the previous frame
    private calculateDeltaTime(timestamp: number): number {
        const deltaTime = timestamp - this._lastTimestamp;
        this._lastTimestamp = timestamp;
        //return Math.min(deltaTime, this.maxDeltaTime);  Removed to catch up to live server
        return deltaTime;
    }

    // This method uses an accumulator pattern to handle time
    private updateGameLogic(update: UpdateFunctionType) {
        this._accumulator += this._deltaTime;

        //if (this._accumulator > this.maxDeltaTime) {   Removed to catch up to live server
        //    this._accumulator = this.maxDeltaTime;
        //}

        const NumberOfUpdates = Math.floor(this._accumulator / this.targetFrameTime);
        if (NumberOfUpdates > 2) {
            Logger.warn("GameLoop", "Catching up. deltaTime:", Math.round(this._deltaTime * 100) / 100,
                ", NumberOfUpdates:", NumberOfUpdates);
        }

        for (let i = 0; i < NumberOfUpdates; i++) {
            this.callUpdate(update);
            this._accumulator -= this.targetFrameTime;
        }
    }

    private callUpdate(update: UpdateFunctionType): void {
        update(this.targetFrameTime / 1000);
        Mouse.Instance.resetMouse();
        Keyboard.Instance.resetKeyboard();
        this._displayFrameUpdateCounter++;
    }

    private callRender(render: RenderFunctionType) {
        render();

        // Display logic
        this._displayFrameRenderCounter++;
        this._displayDTCounter += this._deltaTime / 1000;
        if (this._displayDTCounter >= this.DISPLAY_REFRESH) {
            Window.Instance.setFPSRenderDisplay(this._displayFrameRenderCounter / this.DISPLAY_REFRESH);
            Window.Instance.setFPSUpdateDisplay(this._displayFrameUpdateCounter / this.DISPLAY_REFRESH);
            Window.Instance.setDeltaDisplay(this._displayDTCounter * 1000 / this._displayFrameRenderCounter);
            this._displayDTCounter = 0;
            this._displayFrameRenderCounter = 0;
            this._displayFrameUpdateCounter = 0;

            this.discoverScreenFPS();
        }
    }

    // The start method takes two callbacks: update for game logic and physics, and render for drawing the game
    public start(update: UpdateFunctionType, render: RenderFunctionType) {
        if (this._isRunning) {
            Logger.log("GameLoop", "Loop is already running");
            return;
        }

        Logger.log("GameLoop", "Starting...");
        Logger.log("GameLoop", "Target FPS is set to", this.targetFps);
        Window.Instance.canvas.style.cursor = 'none';

        this._isRunning = true;
        this._lastTimestamp = performance.now();
        this._gameStartTime = this._lastTimestamp;

        const loop = (timestamp: number) => {
            if (!this._isRunning) return;
            this._lastRequestId = requestAnimationFrame(loop);
            this._deltaTime = this.calculateDeltaTime(timestamp);
            this.updateGameLogic(update);
            this.callRender(render);
            // this.discoverScreenFPS();
        };

        this._lastRequestId = requestAnimationFrame(loop);
        Logger.log("GameLoop", "Started loop");
    }

    // The stop() method safely shuts down the game loop
    public stop() {
        if (!this._lastRequestId) {
            Logger.log("GameLoop", "Nothing to stop");
            return;
        }
        Window.Instance.canvas.style.cursor = 'auto';
        this._isRunning = false;
        cancelAnimationFrame(this._lastRequestId);
        this._lastRequestId = undefined;
        this._gameStartTime = 0;
        Logger.log("GameLoop", "Stopped loop");
    }

    // The setTargetFPS() method controls game speed
    public setTargetFPS(fps: number) {
        this.targetFps = clamp(fps, this.MIN_FPS, this.MAX_FPS);
    }

    private discoverScreenFPS(): void {
        if (this.targetFps < 165 && GameLoop.Instance.fps >= 165) {
            Logger.warn("GameLoop", "Changed target FPS from", this.targetFps, "to", 165);
            this.targetFps = 165;
        } else if (this.targetFps < 144 && GameLoop.Instance.fps >= 144) {
            Logger.warn("GameLoop", "Changed target FPS from", this.targetFps, "to", 144);
            this.targetFps = 144;
        } else if (this.targetFps < 120 && GameLoop.Instance.fps >= 120) {
            Logger.warn("GameLoop", "Changed target FPS from", this.targetFps, "to", 120);
            this.targetFps = 120;
        }
    }

}