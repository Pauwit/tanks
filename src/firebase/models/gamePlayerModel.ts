export type GamePlayerModel = {
    dead: boolean;
    position: { x: number; y: number };
    moving: boolean;
    baseRotation: number;
    desiredRotation: number;
    turretRotation: number;
};