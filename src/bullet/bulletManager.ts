import {Bullet} from "./bullet.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {BulletStats} from "./bulletStats.ts";
import {Constants} from "../misc/constants.ts";
import {degToRad} from "../misc/misc.ts";
import {LinkedList} from "../misc/linkedList.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {Point} from "../drawer/point.ts";
import {rectangleCircleCollision, rectangleCollision} from "../misc/collisions.ts";
import {BombManager} from "../bomb/bombManager.ts";

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

    public add(playerId: string, x: number, y: number, rotation: number, stats: BulletStats = Constants.defaultBulletStats): void {
        x = x + Math.cos(-degToRad(rotation)) * Constants.bulletSpawnDistance;
        y = y + Math.sin(degToRad(rotation)) * Constants.bulletSpawnDistance;
        this.bullets.pushBack(new Bullet(playerId, x, y, rotation, stats));
    }

    public remove(index: number): Bullet | null {
        if (index < 0 || index >= this.bullets.length) {
            return null;
        }

        return this.bullets.remove(index);
    }

    public getNBPlayerBullets(id: string): number {
        let nb = 0;
        this.bullets.forEach(bullet => {
            if (bullet.ownerId === id) {
                nb++;
            }
        });

        return nb;
    }

    update(deltaTime: number): boolean {
        this.bullets.forEachDestroy((bullet) => {
            return !bullet.update(deltaTime);
        });

        // Detect collision between bullets
        this.bullets.forEachDestroy((bullet1, i1) => {
            let other = -1;
            this.bullets.forEach((bullet2, i2) => {
                if (other === -1 && i1 !== i2) {
                    let mtv = rectangleCollision(bullet1.rectangle, bullet2.rectangle);

                    if (mtv !== null) {
                        other = i2;
                    }
                }
            });

            return other !== -1;
        });

        // Detect collision with bombs
        BombManager.Instance.bombs.forEachDestroy((bomb) => {
            let other = -1;
            this.bullets.forEach((bullet, i) => {
                if (other === -1) {
                    let mtv = rectangleCircleCollision(bullet.rectangle, bomb.circle);

                    if (mtv !== null) {
                        other = i;
                    }
                }
            });

            if (other !== -1) {
                this.remove(other);
                return true;
            }

            return false;
        });

        return true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.bullets.forEach(bullet => {bullet.draw(ctx)});
    }

    public checkCollision(rect: Rectangle): boolean {
        let found = false;

        let mtv: Point | null;
        this.bullets.forEach((bullet) => {
            mtv = rectangleCollision(rect, bullet.rectangle);

            if (mtv != null) {
                found = true;
                return;
            }
        });

        return found;
    }
}