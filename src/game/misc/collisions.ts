import {Rectangle} from "../drawer/rectangle.ts";
import {degToRad} from "./misc.ts";
import {Point} from "../drawer/point.ts";
import {Circle} from "../drawer/circle.ts";

function getCorners(rect: Rectangle): Point[] {
    const rad = degToRad(rect.rotation);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const hw = rect.width / 2;
    const hh = rect.height / 2;

    const corners: Point[] = [
        new Point(-hw, -hh),
        new Point(hw, -hh),
        new Point(hw, hh),
        new Point(-hw, hh),
    ];

    return corners.map(p => new Point(
        rect.x + p.x * cos - p.y * sin,
        rect.y + p.x * sin + p.y * cos
    ));
}

function getAxes(corners: Point[]): Point[] {
    const axes: Point[] = [];

    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % corners.length];

        const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        const normal = new Point(-edge.y, edge.x).normalize(); // perpendicular
        axes.push(normal);
    }

    return axes;
}

function project(corners: Point[], axis: Point): [number, number] {
    const dots = corners.map((corner) => corner.dot(axis));
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
        const centerA = new Point(rectA.x, rectA.y);
        const centerB = new Point(rectB.x, rectB.y);
        const direction = new Point(centerB.x - centerA.x, centerB.y - centerA.y);

        if (direction.dot(mtvAxis) < 0) {
            mtvAxis = new Point(-mtvAxis.x, -mtvAxis.y);
        }

        return new Point(
            -mtvAxis.x * smallestOverlap,
            -mtvAxis.y * smallestOverlap
        );
    }

    return new Point();
}

function closestPointOnRectangle(rect: Rectangle, point: Point): Point {
    const corners = getCorners(rect);

    // Get local axes
    const axes = [
        new Point(corners[1].x - corners[0].x, corners[1].y - corners[0].y).normalize(), // x-axis
        new Point(corners[3].x - corners[0].x, corners[3].y - corners[0].y).normalize(), // y-axis
    ];

    // Transform point to rectangle local space
    const dx = point.x - rect.x;
    const dy = point.y - rect.y;

    const closest = rect.position;

    for (const axis of axes) {
        const projection = dx * axis.x + dy * axis.y;
        const halfLen = axis === axes[0] ? rect.width / 2 : rect.height / 2;

        const clamped = Math.max(-halfLen, Math.min(projection, halfLen));
        closest.translate(axis.x * clamped, axis.y * clamped);
    }

    return closest;
}

export function rectangleCircleCollision(rect: Rectangle, circle: Circle): null | Point {
    const rectCorners = getCorners(rect);
    const axes = getAxes(rectCorners);

    // Add axis from circle center to closest point on rect
    const closest = closestPointOnRectangle(rect, circle.position);
    const centerToClosest = new Point(closest.x - circle.x, closest.y - circle.y);
    const distSq = centerToClosest.x ** 2 + centerToClosest.y ** 2;

    if (distSq === 0) {
        // Circle center is exactly on rectangle – use an arbitrary normal
        axes.push(new Point(1, 0));
    } else {
        axes.push(centerToClosest.normalize());
    }

    let smallestOverlap = Infinity;
    let mtvAxis: Point | null = null;

    for (const axis of axes) {
        const projRect = project(rectCorners, axis);

        // Project circle
        const centerProjection = circle.position.dot(axis);
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
        const direction = new Point(circle.x - rect.x, circle.y - rect.y);
        if (direction.dot(mtvAxis) < 0) {
            mtvAxis = new Point(-mtvAxis.x, -mtvAxis.y);
        }

        return new Point(
            -mtvAxis.x * smallestOverlap,
            -mtvAxis.y * smallestOverlap,
        );
    }

    return new Point();
}

export function circleCollision(c1: Circle, c2: Circle): null | Point {
    const direction = c2.position.sub(c1.position);
    const distance = direction.length;
    const overlap = c1.radius + c2.radius - distance;

    if (overlap <= 0) {
        return null;
    }

    const mtv = direction.normalize();
    mtv.scale(-overlap);
    return mtv;
}
