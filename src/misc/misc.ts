import {Point} from "../drawer/point.ts";

// Clamps value between min and max
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

// Round to a specific decimal
export function round(value: number, decimals: number): number {
    if (decimals <= 0)
        return value;

    const approx = 10**decimals;
    return Math.round(value * approx) / approx;
}

// Get angle vector from RAD
export function radToPoint(rad: number): Point {
    return new Point(round(Math.cos(-rad), 5), round(Math.sin(rad), 5));
}

// Get angle vector from DEG
export function degToPoint(deg: number): Point {
    return radToPoint(degToRad(mod(deg, 360)));
}

// Ensures positive modulus
export function mod(nb: number, m: number): number {
    return (nb + m) % m;
}

// Find the shortest direction between two DEG angles (true = clockwise)
export function shortestAngleDirection(angleA: number, angleB: number): boolean {
    return (mod(angleA, 360) - mod(angleB, 360) + 720) % 360 > 180;
}
