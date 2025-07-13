
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRectangle(value: any): boolean {
    return ('width' in value) && ('height' in value) && ('rotation' in value) && ('color' in value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCircle(value: any): boolean {
    return ('radius' in value) && ('rotation' in value) && ('color' in value);
}