import type {IDrawable} from "../interfaces/IDrawable.ts";
import type {IUpdatable} from "../interfaces/IUpdatable.ts";
import {LinkedList} from "../misc/linkedList.ts";
import {Constants} from "../constants.ts";
import {Bomb} from "./bomb.ts";
import type {BombStats} from "./bombStats.ts";
import {BulletManager} from "../bullet/bulletManager.ts";
import {ExplosionManager} from "../explosion/explosionManager.ts";

export class BombManager implements IDrawable, IUpdatable {
    private static instance: BombManager = new BombManager();

    private _bombs: LinkedList<Bomb>;

    private constructor() {
        this._bombs = new LinkedList<Bomb>();
    }

    public static get Instance(): BombManager {
        return this.instance;
    }

    public get bombs(): LinkedList<Bomb> {
        return this._bombs;
    }

    public add(playerId: string, x: number, y: number, stats: BombStats = Constants.defaultBombStats): void {
        this.bombs.pushBack(new Bomb(playerId, x, y, stats));
    }

    public getNBPlayerBullets(id: string): number {
        let nb = 0;
        this.bombs.forEach(bomb => {
            if (bomb.ownerId === id) {
                nb++;
            }
        });

        return nb;
    }

    update(deltaTime: number): boolean {
        this.bombs.forEachDestroy((bomb) => {
            if (!bomb.update(deltaTime)) {
                bomb.explode();
                return true;
            }
            return false;
        });

        this.bombs.forEachDestroy((bomb) => {
            // Detect collision with bullets
            if (BulletManager.Instance.checkCollisionCircle(bomb.circle)) {
                bomb.explode();
                return true;
            }

            // Detect collision with explosions
            if (ExplosionManager.Instance.checkCollisionCircle(bomb.circle)) {
                bomb.explode();
                return true;
            }

            return false;
        });

        return true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.bombs.forEach(bomb => {
            bomb.draw(ctx)
        });
    }
}