export type GameExplosionModel = {
    position: { x: number; y: number };
    times: {
        total: number;
        current: number;
    };
};