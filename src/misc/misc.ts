
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
