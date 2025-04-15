import {Rectangle} from "../drawer/rectangle.ts";
import {degToRad} from "./misc.ts";
import {Point} from "./point.ts";
import {Circle} from "../drawer/circle.ts";

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

function dot(a: Point, b: Point): number {
    return a.x * b.x + a.y * b.y;
}

function normalize(v: Point): Point {
    const len = Math.hypot(v.x, v.y);
    return { x: v.x / len, y: v.y / len };
}

function getAxes(corners: Point[]): Point[] {
    const axes: Point[] = [];

    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % corners.length];

        const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        const normal = normalize({ x: -edge.y, y: edge.x }); // perpendicular
        axes.push(normal);
    }

    return axes;
}

function project(corners: Point[], axis: Point): [number, number] {
    const dots = corners.map((corner) => dot(corner, axis));
    return [Math.min(...dots), Math.max(...dots)];
}

function overlap(p1: [number, number], p2: [number, number]): boolean {
    return p1[1] >= p2[0] && p2[1] >= p1[0];
}

export function rectangleCollision(rectA: Rectangle, rectB: Rectangle): null | Point {
    const cornersA = getCorners(rectA);
    const cornersB = getCorners(rectB);

    const axes = [...getAxes(cornersA), ...getAxes(cornersB)];

    let smallestOverlap = Infinity;
    let mtvAxis: Point | null = null;

    for (const axis of axes) {
        const projA = project(cornersA, axis);
        const projB = project(cornersB, axis);

        if (!overlap(projA, projB)) {
            return null; // separation found!
        }

        const overlapAmount = Math.min(projA[1], projB[1]) - Math.max(projA[0], projB[0]);
        if (overlapAmount < smallestOverlap) {
            smallestOverlap = overlapAmount;
            mtvAxis = axis;
        }
    }

    if (mtvAxis) {
        // Ensure the MTV points from A to B
        const centerA = { x: rectA.x, y: rectA.y };
        const centerB = { x: rectB.x, y: rectB.y };
        const direction = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };

        if (dot(direction, mtvAxis) < 0) {
            mtvAxis = { x: -mtvAxis.x, y: -mtvAxis.y };
        }

        return {
            x: -mtvAxis.x * smallestOverlap,
            y: -mtvAxis.y * smallestOverlap,
        };
    }

    return { x: 0, y: 0 };
}

function closestPointOnRectangle(rect: Rectangle, point: Point): Point {
    const corners = getCorners(rect);

    // Get local axes
    const axes = [
        normalize({ x: corners[1].x - corners[0].x, y: corners[1].y - corners[0].y }), // x-axis
        normalize({ x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y }), // y-axis
    ];

    // Transform point to rectangle local space
    const dx = point.x - rect.x;
    const dy = point.y - rect.y;

    let closest = { x: rect.x, y: rect.y };

    for (const axis of axes) {
        const projection = dx * axis.x + dy * axis.y;
        const halfLen = axis === axes[0] ? rect.width / 2 : rect.height / 2;

        const clamped = Math.max(-halfLen, Math.min(projection, halfLen));
        closest.x += axis.x * clamped;
        closest.y += axis.y * clamped;
    }

    return closest;
}

export function rectangleCircleCollision(rect: Rectangle, circle: Circle): null | Point {
    const rectCorners = getCorners(rect);
    const axes = getAxes(rectCorners);

    // Add axis from circle center to closest point on rect
    const closest = closestPointOnRectangle(rect, { x: circle.x, y: circle.y });
    const centerToClosest = { x: closest.x - circle.x, y: closest.y - circle.y };
    const distSq = centerToClosest.x ** 2 + centerToClosest.y ** 2;

    if (distSq === 0) {
        // Circle center is exactly on rectangle – use an arbitrary normal
        axes.push({ x: 1, y: 0 });
    } else {
        axes.push(normalize(centerToClosest));
    }

    let smallestOverlap = Infinity;
    let mtvAxis: Point | null = null;

    for (const axis of axes) {
        const projRect = project(rectCorners, axis);

        // Project circle
        const centerProjection = dot({ x: circle.x, y: circle.y }, axis);
        const projCircle: [number, number] = [
            centerProjection - circle.radius,
            centerProjection + circle.radius,
        ];

        if (!overlap(projRect, projCircle)) {
            return null;
        }

        const overlapAmount = Math.min(projRect[1], projCircle[1]) - Math.max(projRect[0], projCircle[0]);

        if (overlapAmount < smallestOverlap) {
            smallestOverlap = overlapAmount;
            mtvAxis = axis;
        }
    }

    if (mtvAxis) {
        // Make MTV point from rect to circle
        const direction = { x: circle.x - rect.x, y: circle.y - rect.y };
        if (dot(direction, mtvAxis) < 0) {
            mtvAxis = { x: -mtvAxis.x, y: -mtvAxis.y };
        }

        return {
            x: -mtvAxis.x * smallestOverlap,
            y: -mtvAxis.y * smallestOverlap,
        };
    }

    return { x: 0, y: 0 };
}
