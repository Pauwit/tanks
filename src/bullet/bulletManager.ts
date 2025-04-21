import {Bullet} from "./bullet.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {BulletStats} from "./bulletStats.ts";
import {Constants} from "../misc/constants.ts";
import {degToRad} from "../misc/misc.ts";

export class BulletManager implements IDrawable, IUpdatable {
    private static instance: BulletManager = new BulletManager();

    private readonly _bullets: Array<Bullet>;

    private constructor() {
        this._bullets = new Array<Bullet>();
    }

    public static get Instance(): BulletManager {
        return this.instance;
    }

    public get bullets(): Array<Bullet> {
        return this._bullets;
    }

    public static add(x: number, y: number, rotation: number, stats: BulletStats = Constants.defaultBulletStats): void {
        x = x + Math.cos(-degToRad(rotation)) * Constants.defaultBulletSpawnDistance;
        y = y + Math.sin(degToRad(rotation)) * Constants.defaultBulletSpawnDistance;
        this.Instance.bullets.push(new Bullet(x, y, rotation, stats));
    }

    update(deltaTime: number): void {
        BulletManager.Instance.bullets.forEach(bullet => {bullet.update(deltaTime)});
    }

    draw(ctx: CanvasRenderingContext2D): void {
        BulletManager.Instance.bullets.forEach(bullet => {bullet.draw(ctx)});
    }
}