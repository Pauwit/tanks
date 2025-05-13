import {IUpdatable} from "../misc/IUpdatable.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {LinkedList} from "../misc/linkedList.ts";
import {Explosion} from "./explosion.ts";
import {Constants} from "../misc/constants.ts";
import {ExplosionStats} from "./explosionStats.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {Point} from "../drawer/point.ts";
import {rectangleCircleCollision} from "../misc/collisions.ts";

export class ExplosionManager implements IUpdatable, IDrawable {
    private static instance: ExplosionManager = new ExplosionManager();

    private _explosions: LinkedList<Explosion>;

    private constructor() {
        this._explosions = new LinkedList<Explosion>();
    }

    public static get Instance(): ExplosionManager {
        return this.instance;
    }

    public get explosions(): LinkedList<Explosion> {
        return this._explosions;
    }

    public add(x: number, y: number, stats: ExplosionStats = Constants.defaultExplosionStats): void {
        this.explosions.pushBack(new Explosion(x, y, stats));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.explosions.forEach((explosion) => explosion.draw(ctx));
    }

    public update(deltaTime: number): boolean {
        this.explosions.forEachDestroy((explosion) => !explosion.update(deltaTime));

        return true;
    }

    public checkCollision(rect: Rectangle): boolean {
        let found = false;

        let mtv: Point | null;
        this.explosions.forEach((explosion) => {
            if (found) {
                return;
            }

            mtv = rectangleCircleCollision(rect, explosion.circle);

            if (mtv != null) {
                found = true;
                return;
            }
        });

        return found;
    }

}