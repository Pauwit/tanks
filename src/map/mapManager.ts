import {Shape} from "../drawer/shape.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {Point} from "../drawer/point.ts";
import {isCircle, isRectangle} from "../misc/cast.ts";
import {rectangleCircleCollision, rectangleCollision} from "../misc/collisions.ts";
import {Circle} from "../drawer/circle.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {LinkedList} from "../misc/linkedList.ts";

export class MapManager implements IDrawable {
    private static instance: MapManager = new MapManager();

    private readonly _map: LinkedList<Shape>;

    private constructor() {
        this._map = new LinkedList<Shape>();
    }

    public static get Instance() {
        return MapManager.instance;
    }

    public static add(shape: Shape): void {
        this.Instance._map.pushBack(shape);
    }

    public static get map() {
        return this.Instance._map;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        MapManager.Instance._map.forEach(shape => {shape.draw(ctx)});
    }

    public static applyCollision(rect: Rectangle, multiplier: number = 1): Rectangle | null {
        let found: boolean = false;

        let mtv: Point | null;
        this.map.forEach((shape) => {
            mtv = null;
            if (isCircle(shape)) {
                mtv = rectangleCircleCollision(rect, shape as Circle);
            } else if (isRectangle(shape)) {
                mtv = rectangleCollision(rect, shape as Rectangle);
            }

            if (mtv != null) {
                found = true;
                mtv.scale(multiplier);
                rect.translate_point(mtv);
            }
        });

        return found ? rect : null;
    }

}