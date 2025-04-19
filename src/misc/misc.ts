
// Clamps value between min and max
import {Point} from "../drawer/point.ts";

export function clamp(value: number, min: number, max: number): number {
    if (value >= max)
        return max;

    if (value <= min)
        return min;

    return value;
}

// Converts RAD to DEG
export function radToDeg(rad: number): number {
    return rad * (180 / Math.PI);
}

// Converts DEG to RAD
export function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}

// Get angle vector from RAD
export function radToPoint(rad: number): Point {
    return new Point(Math.cos(-rad), Math.sin(-rad));
}

// Get angle vector from DEG
export function degToPoint(deg: number): Point {
    return radToPoint(degToRad(deg));
}
