import {Logger} from "./logger.ts";

export class AudioManager {
    private readonly PATH_AUDIO : string = "/public/audio/";

    private static instance : AudioManager = new AudioManager();

    private readonly _moveSound = new Audio(this.audioPath("move.wav"));
    private readonly _destroyedBullet = new Audio(this.audioPath("bullet_des.wav"));
    private readonly _bounceBullet = new Audio(this.audioPath("bounce.wav"));
    private readonly _shoot1 = new Audio(this.audioPath("bullet_shoot1.wav"));
    private readonly _bombPlace = new Audio(this.audioPath("bomb_place.wav"));
    private readonly _bombBip = new Audio(this.audioPath("bomb_bip.wav"));
    private readonly _explosion = new Audio(this.audioPath("explosion.wav"));
    private readonly _destroyedTank = new Audio(this.audioPath("destroy.wav"));

    private constructor() {
        this.importAudio();
    }

    public static get Instance(): AudioManager {
        return this.instance;
    }

    public static playMoveSound(): void {
        this.Instance._moveSound.currentTime = 0;
        this.Instance._moveSound.play();
    }

    public static playDestroyedBullet(): void {
        this.Instance._destroyedBullet.currentTime = 0;
        this.Instance._destroyedBullet.play();
    }

    public static playBounceBullet(): void {
        this.Instance._bounceBullet.currentTime = 0;
        this.Instance._bounceBullet.play();
    }

    public static playShoot(): void {
        this.Instance._shoot1.currentTime = 0;
        this.Instance._shoot1.play();
    }

    public static playBombPlace(): void {
        this.Instance._bombPlace.currentTime = 0;
        this.Instance._bombPlace.play();
    }

    public static playBombBip(): void {
        this.Instance._bombBip.currentTime = 0;
        this.Instance._bombBip.play();
    }

    public static playExplosion(): void {
        this.Instance._explosion.currentTime = 0;
        this.Instance._explosion.play();
    }

    public static playDestroyedTank(): void {
        this.Instance._destroyedTank.currentTime = 0;
        this.Instance._destroyedTank.play();
    }

    private importAudio() : void {
        Logger.log("AudioManager", "Importing audio...");

        /*
        this._moveSound.src = this.audioPath("move.wav");
        this._destroyedBullet.src = this.audioPath("bullet_des.wav");
        this._bounceBullet.src = this.audioPath("bounce.wav");
        this._shoot1.src = this.audioPath("bullet_shoot1.wav");
        this._bombPlace.src = this.audioPath("bomb_place.wav");
        this._bombBip.src = this.audioPath("bomb_bip.wav");
        this._explosion.src = this.audioPath("explosion.wav");
        this._destroyedTank.src = this.audioPath("destroy.wav");
         */

        this._moveSound.volume = 0.1;
        this._destroyedBullet.volume = 0.5;
        this._bounceBullet.volume = 0.5;
        this._shoot1.volume = 0.5;
        this._bombPlace.volume = 0.3;
        this._bombBip.volume = 0.3;
        this._explosion.volume = 0.5;
        this._destroyedTank.volume = 0.4;

        Logger.log("AudioManager", "Finished importing audio");
    }

    private audioPath(name: string): string {
        return this.PATH_AUDIO + name;
    }
}