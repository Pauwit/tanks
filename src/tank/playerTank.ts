import {Tank} from "./tank";
import {TankStats} from "./tankStats.ts";
import {Constants} from "../misc/constants.ts";
import {Point} from "../drawer/point.ts";
import {Keyboard} from "../input/keyboard.ts";
import {KeyBindings} from "../input/keyBindings.ts";
import {drawCrosshair} from "../drawer/drawer.ts";
import {Mouse} from "../input/mouse.ts";
import {BulletManager} from "../bullet/bulletManager.ts";
import {AudioManager} from "../misc/audioManager.ts";
import {BombManager} from "../bomb/bombManager.ts";

export class PlayerTank extends Tank {

    private readonly _id: string;

    constructor(id: string, x: number = 0, y: number = 0, turretRotation: number = 0, baseRotation: number = 0,
                tankStats: TankStats = Constants.defaultTankStats) {
        super(x, y, turretRotation, baseRotation, tankStats, Constants.playerTankBaseColor, Constants.playerTankTurretColor); // wheels: "#002845"
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    override update(deltaTime: number): boolean {
        this.handleKeyboardInput();
        this.handleMouseInput();
        this.checkDeath();

        return super.update(deltaTime);
    }

    private handleKeyboardInput(): void {
        // Movement
        const direction: Point = new Point();
        if (Keyboard.Instance.maintained(KeyBindings.moveUp)) {
            direction.translate(0, -1);
        }
        if (Keyboard.Instance.maintained(KeyBindings.moveDown)) {
            direction.translate(0, 1);
        }
        if (Keyboard.Instance.maintained(KeyBindings.moveLeft)) {
            direction.translate(-1, 0);
        }
        if (Keyboard.Instance.maintained(KeyBindings.moveRight)) {
            direction.translate(1, 0);
        }

        if (direction.zero) {
            this.moving = false;
            return;
        }

        this.moving = true;
        this.baseRotation = direction.rotation;

        // Place bomb
        if (Keyboard.Instance.pressed(KeyBindings.placeBomb)) {
            this.placeBomb();
        }
    }

    private placeBomb(): void {
        if(BombManager.Instance.getNBPlayerBullets(this.id) < this.tankStats.maxBombs) {
            AudioManager.playBombPlace();
            BombManager.Instance.add(this.id, this.x, this.y);
        }
    }

    private handleMouseInput(): void {
        const direction = Mouse.Instance.position.sub(this.position);
        this.turretRotation = direction.rotation;

        if (Mouse.Instance.clicked) {
            if (BulletManager.Instance.getNBPlayerBullets(this.id) < this.tankStats.maxBullets) {
                AudioManager.playShoot();
                BulletManager.Instance.add(this.id, this.x, this.y, this.turretRotation);
            }
        }
    }

    public drawCrosshair(): void {
        drawCrosshair(this.x, this.y);
    }
}