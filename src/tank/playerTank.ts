import {Tank} from "./tank";
import {TankStats} from "./tankStats.ts";
import {Constants} from "../misc/constants.ts";
import {Point} from "../drawer/point.ts";
import {Keyboard} from "../input/keyboard.ts";
import {KeyBindings} from "../input/keyBindings.ts";
import {drawCrosshair} from "../drawer/drawer.ts";
import {Mouse} from "../input/mouse.ts";
import {BulletManager} from "../bullet/bulletManager.ts";
import {Bullet} from "../bullet/bullet.ts";
import {AudioManager} from "../misc/audioManager.ts";

export class PlayerTank extends Tank {

    constructor(x: number = 0, y: number = 0, turretRotation: number = 0, baseRotation: number = 0,
                tankStats: TankStats = Constants.defaultTankStats) {
        super(x, y, turretRotation, baseRotation, tankStats, "#004d86", "#0088c0"); // wheels: "#002845"
    }

    override update(deltaTime: number) {
        this.handleKeyboardInput();
        this.handleMouseInput();

        super.update(deltaTime);
    }

    private handleKeyboardInput(): void {
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
    }

    private handleMouseInput(): void {
        const direction = Mouse.Instance.position.sub(this.position);
        this.turretRotation = direction.rotation;

        if (Mouse.Instance.clicked) {
            AudioManager.playShoot();
            BulletManager.add(this.x, this.y, this.turretRotation);
        }
    }

    public drawCrosshair(): void {
        drawCrosshair(this.x, this.y);
    }
}