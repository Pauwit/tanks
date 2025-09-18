export type GameBulletModel = {
    position: { x: number; y: number };
    rotation: number;
};

export const defaultBullet: GameBulletModel = {
    position: {x: 0, y: 0},
    rotation: 0
}