import {IDrawable} from "../misc/IDrawable.ts";
import {IUpdatable} from "../misc/IUpdatable.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {BulletStats} from "./bulletStats.ts";
import {Constants} from "../misc/constants.ts";
import {degToPoint} from "../misc/misc.ts";
import {MapManager} from "../map/mapManager.ts";
import {Point} from "../drawer/point.ts";

export class Bullet implements IDrawable, IUpdatable {
    private _rectangle: Rectangle;

    private _stats: BulletStats;

    private _currentBounce: number;

    constructor(x: number, y: number, rotation: number, stats: BulletStats = Constants.defaultBulletStats) {
        this._rectangle = new Rectangle(x, y, Constants.defaultBulletWidth, Constants.defaultBulletHeight, rotation, "#f00");

        this._stats = stats;
        this._currentBounce = 0;
    }

    update(deltaTime: number): void {
        const direction = degToPoint(this._rectangle.rotation);
        direction.scale(this._stats.moveSpeed * deltaTime);
        this._rectangle.translate_point(direction);

        // Bounce
        const old = new Point(this._rectangle.x, this._rectangle.y);
        const res = MapManager.applyCollision(this._rectangle);
        if (res != null) {
            const sub = res.position.sub(old);
            console.log(old, res, sub, old.rotation, res.rotation, sub.rotation, sub.rotation - this._rectangle.rotation);
            this._rectangle.rotation = sub.rotation;
            this._rectangle.translate_point(sub);

        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._rectangle.draw(ctx);
    }

    private calcBounceAngle(rect: Rectangle, old: Point, oldRotation: number): number {
        const force = rect.position;
        if (force.equal(old.position))
            return oldRotation;
        console.log("change", old.rotation, "to", force.rotation);
        return force.rotation;
    }
}