import {Rectangle} from "../drawer/rectangle.ts";
import {degToRad} from "./misc.ts";

type Point = { x: number, y: number };

function getCorners(rect: Rectangle): Point[] {
    const rad = degToRad(rect.rotation);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const hw = rect.width / 2;
    const hh = rect.height / 2;

    const corners: Point[] = [
        {x: -hw, y: -hh},
        {x: hw, y: -hh},
        {x: hw, y: hh},
        {x: -hw, y: hh},
    ];

    return corners.map(p => ({
        x: rect.x + p.x * cos - p.y * sin,
        y: rect.y + p.x * sin + p.y * cos
    }));
}

function getAxes(corners: Point[]): Point[] {
    const axes: Point[] = [];
    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % corners.length];
        const edge = {x: p2.x - p1.x, y: p2.y - p1.y};
        // normal (perpendicular vector)
        const normal = {x: -edge.y, y: edge.x};
        // normalize
        const length = Math.hypot(normal.x, normal.y);
        axes.push({x: normal.x / length, y: normal.y / length});
    }
    return axes;
}

function project(points: Point[], axis: Point): { min: number, max: number } {
    const dots = points.map(p => p.x * axis.x + p.y * axis.y);
    return { min: Math.min(...dots), max: Math.max(...dots) };
}

export function rectangleCollision(r1: Rectangle, r2: Rectangle): boolean {
    const corners1 = getCorners(r1);
    const corners2 = getCorners(r2);

    const axes1 = getAxes(corners1);
    const axes2 = getAxes(corners2);
    const axes = [...axes1, ...axes2];

    for (const axis of axes) {
        const proj1 = project(corners1, axis);
        const proj2 = project(corners2, axis);
        if (proj1.max >= proj2.min && proj2.max >= proj1.min) {
            return false; // Separation found
        }
    }

    return true; // No separation, collision exists
}