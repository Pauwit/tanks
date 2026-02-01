import type {IUpdatable} from "../interfaces/IUpdatable.ts";
import type {TankStats} from "./tankStats.ts";
import {Constants} from "../constants.ts";
import type {IDrawable} from "../interfaces/IDrawable.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {degToPoint, degToRad, mod, shortestAngleDirection} from "../misc/misc.ts";
import {Point} from "../drawer/point.ts";
import {BulletManager} from "../bullet/bulletManager.ts";
import {ExplosionManager} from "../explosion/explosionManager.ts";
import {ImageManager} from "../misc/imageManager.ts";
import {Window} from "../drawer/window.ts";
import {Logger} from "../misc/Logger.ts";

export abstract class Tank implements IUpdatable, IDrawable {
    private _base: Rectangle;
    private _turret: Rectangle;

    private _tankStats: TankStats;

    private _baseDesiredRotation: number;
    private _baseRotationDirection: boolean;
    private _moving: boolean;
    private _desiredMoving: boolean;

    protected _dead: boolean;
    private readonly _id: string;


    protected constructor(id: string, x: number = 0, y: number = 0, turretRotation: number = 0, baseRotation: number = 0,
                          tankStats: TankStats = Constants.defaultTankStats, baseColor: string, turretColor: string, dead = false) {

        this._base = new Rectangle(x, y, Constants.tankBaseWidth, Constants.tankBaseHeight, baseRotation, baseColor);
        this._turret = new Rectangle(x, y, Constants.tankTurretSize, Constants.tankTurretSize, turretRotation, turretColor);

        this._tankStats = tankStats;
        this._baseDesiredRotation = mod(baseRotation, 360);
        this._moving = false;
        this._desiredMoving = false;
        this._baseRotationDirection = false;

        this._dead = dead;
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    protected get x(): number {
        return this._base.x;
    }

    protected get y(): number {
        return this._base.y;
    }

    protected set x(x: number) {
        this._base.x = x;
        this._turret.x = x;
    }

    protected set y(y: number) {
        this._base.y = y;
        this._turret.y = y;
    }

    public get position(): Point {
        return this._base.position;
    }

    public get base(): Rectangle {
        return this._base;
    }

    get tankStats(): TankStats {
        return this._tankStats;
    }

    protected get baseRotation(): number {
        return this._base.rotation;
    }

    protected set baseRotation(baseRotation: number) {
        this._base.rotation = baseRotation;
    }

    protected set desiredBaseRotation(desired: number) {
        desired = mod(desired, 360);
        if (desired == this._baseDesiredRotation) {
            return;
        }

        this._baseDesiredRotation = desired;
        this._baseRotationDirection = shortestAngleDirection(desired, this._base.rotation);

        // Can move in opposite direction instantly or if direction is approx same (controller fix)
        if (mod(this._baseDesiredRotation + 180, 360) == this._base.rotation ||
            Math.abs(this._baseDesiredRotation - this._base.rotation) < Constants.moveAngleThreshold) {
            this._base.rotation = this._baseDesiredRotation;
        }
    }

    protected set turretRotation(rotation: number) {
        this._turret.rotation = rotation;
    }

    protected get turretRotation(): number {
        return this._turret.rotation;
    }

    private set moving(moving: boolean) {
        this._moving = moving;
    }

    protected get moving(): boolean {
        return this._moving;
    }

    protected set desiredMoving(desiredMoving: boolean) {
        this._desiredMoving = desiredMoving;
    }

    protected get desiredMoving(): boolean {
        return this._desiredMoving;
    }

    update(deltaTime: number): boolean {
        if (this._dead) {
            this.moving = false;
            return true;
        }

        this.handleBaseRotationUpdate(deltaTime);
        this.handleBaseMovementUpdate(deltaTime);

        return true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this._dead) {
            const img = ImageManager.playerDeath;
            ctx.drawImage(img, this.x - img.width, this.y - img.height, img.width * 2, img.height * 2);
        }
        else {
            this._base.draw(ctx);
            this.drawTurretCannon(ctx);
            this._turret.draw(ctx);
        }
    }

    protected handleBaseRotationUpdate(deltaTime: number): void {
        if (this._baseDesiredRotation != this._base.rotation) {
            const direction = this._baseRotationDirection ? -1 : 1;
            this._base.rotate(direction * this._tankStats.rotationSpeed * deltaTime);

            if (shortestAngleDirection(this._baseDesiredRotation, this._base.rotation) != this._baseRotationDirection) {
                this._base.rotation = this._baseDesiredRotation;
            }
        }
    }

    protected handleBaseMovementUpdate(deltaTime: number): void {
        const condition = this.desiredMoving && this._baseDesiredRotation == this._base.rotation;
        this.move(condition, deltaTime);
    }

    protected move(condition: boolean, deltaTime: number): void {
        if (condition) {
            const direction = degToPoint(this._base.rotation);
            direction.scale(this._tankStats.moveSpeed * deltaTime);
            this._base.translate_point(direction);
            this._turret.translate_point(direction);

            this.moving = true;
        }
        else {
            this.moving = false;
        }

    }

    public applyCollision(rect: Rectangle | null): void {
        if (rect == null)
            return;

        this._base.setPosition(rect);
        this._turret.setPosition(rect);
    }

    private drawTurretCannon(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();

        ctx.translate(this.x, this.y);
        ctx.rotate(degToRad(this._turret.rotation));
        ctx.fillStyle = this._turret.color;
        ctx.fillRect(0, -Constants.tankTurretCannonHeight / 2,
          Constants.tankTurretCannonWidth, Constants.tankTurretCannonHeight);

        ctx.closePath();
        ctx.restore();
    }

    protected checkDeath(): void {
        let hit = BulletManager.Instance.checkCollision(this.base);
        if (hit) {
            Logger.log(null, "Death by Bullet");
            this.death();
        }
        hit = ExplosionManager.Instance.checkCollision(this.base);
        if (hit) {
            Logger.log(null, "Death by Explosion");
            this.death();
        }
    }

    public death(): void {
        this._dead = true;
        Window.Instance.changeCursor(true);
    }

    public respawn(): void {
        this._dead = false;
        Window.Instance.changeCursor(false);
    }

}