import {Shape} from "../drawer/shape.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {Point} from "../drawer/point.ts";
import {isCircle, isRectangle} from "../misc/cast.ts";
import {rectangleCircleCollision, rectangleCollision} from "../misc/collisions.ts";
import {Circle} from "../drawer/circle.ts";
import {IDrawable} from "../misc/IDrawable.ts";

export class MapManager implements IDrawable {
    private static instance: MapManager = new MapManager();

    private readonly _map: Array<Shape>;

    private constructor() {
        this._map = new Array<Shape>();
    }

    public static get Instance() {
        return MapManager.instance;
    }

    public static add(shape: Shape): void {
        this.Instance._map.push(shape);
    }

    public static get map() {
        return this.Instance._map;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        MapManager.Instance._map.forEach(shape => {shape.draw(ctx)});
    }

    public static applyCollision(rect: Rectangle): Rectangle | null {
        let m = this.map;
        let found: boolean = false;

        let mtv: Point | null;
        for (let i = 0; i < m.length; i++) {
            mtv = null;
            if (isCircle(m[i])) {
                mtv = rectangleCircleCollision(rect, m[i] as Circle);
            } else if (isRectangle(m[i])) {
                mtv = rectangleCollision(rect, m[i] as Rectangle);
            }

            if (mtv != null) {
                found = true;
                rect.translate_point(mtv);
            }
        }

        return found ? rect : null;
    }

}