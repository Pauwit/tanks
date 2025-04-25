import {Bullet} from "./bullet.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {BulletStats} from "./bulletStats.ts";
import {Constants} from "../misc/constants.ts";
import {degToRad} from "../misc/misc.ts";
import {LinkedList} from "../misc/linkedList.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {Point} from "../drawer/point.ts";
import {rectangleCollision} from "../misc/collisions.ts";

export class BulletManager implements IDrawable, IUpdatable {
    private static instance: BulletManager = new BulletManager();

    private _bullets: LinkedList<Bullet>;

    private constructor() {
        this._bullets = new LinkedList<Bullet>();
    }

    public static get Instance(): BulletManager {
        return this.instance;
    }

    public get bullets(): LinkedList<Bullet> {
        return this._bullets;
    }

    public static add(x: number, y: number, rotation: number, stats: BulletStats = Constants.defaultBulletStats): void {
        x = x + Math.cos(-degToRad(rotation)) * Constants.defaultBulletSpawnDistance;
        y = y + Math.sin(degToRad(rotation)) * Constants.defaultBulletSpawnDistance;
        this.Instance.bullets.pushBack(new Bullet(x, y, rotation, stats));
    }

    update(deltaTime: number): boolean {
        BulletManager.Instance.bullets.forEachDestroy((bullet) => {
            return !bullet.update(deltaTime);
        });

        // Detect collision between bullets
        // TODO

        return true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        BulletManager.Instance.bullets.forEach(bullet => {bullet.draw(ctx)});
    }

    public static checkCollision(rect: Rectangle): boolean {
        let found = false;

        let mtv: Point | null;
        this.Instance.bullets.forEach((bullet) => {
            mtv = rectangleCollision(rect, bullet.rectangle);

            if (mtv != null) {
                found = true;
                return;
            }
        });

        return found;
    }
}