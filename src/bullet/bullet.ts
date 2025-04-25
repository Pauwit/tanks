import {IDrawable} from "../misc/IDrawable.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {BulletStats} from "./bulletStats.ts";
import {Constants} from "../misc/constants.ts";
import {degToPoint} from "../misc/misc.ts";
import {MapManager} from "../map/mapManager.ts";
import {Point} from "../drawer/point.ts";
import {AudioManager} from "../misc/audioManager.ts";
import {Window} from "../drawer/window.ts";

export class Bullet implements IDrawable, IUpdatable {
    private _rectangle: Rectangle;

    private _stats: BulletStats;

    private _currentBounce: number;

    constructor(x: number, y: number, rotation: number, stats: BulletStats = Constants.defaultBulletStats) {
        this._rectangle = new Rectangle(x, y, Constants.defaultBulletWidth, Constants.defaultBulletHeight, rotation, "#f00");

        this._stats = stats;
        this._currentBounce = 0;
    }

    get rectangle(): Rectangle {
        return this._rectangle;
    }

    update(deltaTime: number): boolean {
        // Movement
        const direction = degToPoint(this._rectangle.rotation);
        direction.scale(this._stats.moveSpeed * deltaTime);
        this._rectangle.translate_point(direction);
        if (Window.Instance.outOfBounds(this._rectangle.x, this._rectangle.y)) {
            return false;
        }

        // Bounce
        const old = new Point(this._rectangle.x, this._rectangle.y);
        const res = MapManager.applyCollision(this._rectangle);
        if (res != null) {
            if (this._currentBounce >= this._stats.maxBounces) {
                AudioManager.playDestroyedBullet();
                return false;
            }
            this._currentBounce++;
            AudioManager.playBounceBullet();

            // Position
            this._rectangle.setPosition(res);

            // Rotation
            this._rectangle.rotation = this.calcBounceAngle(res, old);
        }

        return true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._rectangle.draw(ctx);
    }

    private calcBounceAngle(res: Rectangle, old: Point): number {
        const mtv = res.position.sub(old);
        const mtvNorm = mtv.normalize();

        const incoming = degToPoint(this._rectangle.rotation);
        const dot = incoming.dot(mtvNorm);
        mtvNorm.scale(2 * dot);
        const reflected = incoming.sub(mtvNorm);

        return reflected.rotation;
    }
}