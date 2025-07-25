import {Mouse} from "./input/mouse.ts";
import {Keyboard} from "./input/keyboard.ts";
import {Window} from "./drawer/window.ts";
import {clamp} from "./misc/misc.ts";
import {Logger} from "./misc/Logger.ts";

export class GameLoop {
    // FPS settings

    private readonly DEFAULT_FPS = 180;
    private readonly MIN_FPS = 20;
    private readonly MAX_FPS = this.DEFAULT_FPS;
    private targetFps: number = this.DEFAULT_FPS; // This has to change with the screen fps

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
        return Math.min(deltaTime, this.maxDeltaTime);
    }

    // This method uses an accumulator pattern to handle time
    private updateGameLogic(update: (dt: number) => void) {
        this._accumulator += this._deltaTime;

        if (this._accumulator > this.maxDeltaTime) {
            this._accumulator = this.maxDeltaTime;
        }

        const NumberOfUpdates = Math.floor(this._accumulator / this.targetFrameTime);
        for (let i = 0; i < NumberOfUpdates; i++) {
            this.callUpdate(update);
            this._accumulator -= this.targetFrameTime;
        }
    }

    private callUpdate(update: (dt: number) => void): void {
        update(this.targetFrameTime / 1000);
        Mouse.Instance.resetMouse();
        Keyboard.Instance.resetKeyboard();
    }

    private callRender(render: () => void) {
        render();
        Window.Instance.setFPSDisplay(GameLoop.Instance.fps);
        Window.Instance.setDeltaDisplay(GameLoop.Instance.deltaTime);
    }

    // The start method takes two callbacks: update for game logic and physics, and render for drawing the game
    public start(update: (dt: number) => void, render: () => void) {
        if (this._isRunning)
            return;

        Logger.log("GameLoop", "Starting...");
        Logger.log("GameLoop", "Target FPS is set to", this.targetFps);

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

        requestAnimationFrame(loop);
    }

    // The stop() method safely shuts down the game loop
    public stop() {
        if (!this._lastRequestId) return;
        this._isRunning = false;
        cancelAnimationFrame(this._lastRequestId);
        this._lastRequestId = undefined;
        this._gameStartTime = 0;
    }

    // The setTargetFPS() method controls game speed
    public setTargetFPS(fps: number) {
        this.targetFps = clamp(fps, this.MIN_FPS, this.MAX_FPS);
    }

    private discoverScreenFPS(): void {
        if (this.targetFps < 165 && GameLoop.Instance.fps >= 165) {
            Logger.warn("GameLoop", "Changed target FPS from", this.targetFps, "to", 165);
            this.targetFps = 165;
        }
        if (this.targetFps < 144 && GameLoop.Instance.fps >= 144) {
            Logger.warn("GameLoop", "Changed target FPS from", this.targetFps, "to", 144);
            this.targetFps = 144;
        }
        if (this.targetFps < 120 && GameLoop.Instance.fps >= 120) {
            Logger.warn("GameLoop", "Changed target FPS from", this.targetFps, "to", 120);
            this.targetFps = 120;
        }
    }

}