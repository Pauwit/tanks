export type GameExplosionModel = {
    position: { x: number; y: number };
    times: {
        total: number;
        current: number;
    };
};

export const defaultExplosion: GameExplosionModel = {
    position: { x: 0, y: 0 },
    times: {
        total: 0,
        current: 0,
    }
}