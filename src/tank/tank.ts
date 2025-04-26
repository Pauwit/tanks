import {IUpdatable} from "../misc/IUpdatable.ts";
import {TankStats} from "./tankStats.ts";
import {Constants} from "../misc/constants.ts";
import {IDrawable} from "../misc/IDrawable.ts";
import {Rectangle} from "../drawer/rectangle.ts";
import {degToPoint, degToRad, mod, shortestAngleDirection} from "../misc/misc.ts";
import {Point} from "../drawer/point.ts";

export abstract class Tank implements IUpdatable, IDrawable {
    private _base: Rectangle;
    private _turret: Rectangle;

    private _tankStats: TankStats;

    private _baseDesiredRotation: number;
    private _baseRotationDirection: boolean;
    private _moving: boolean;


    protected constructor(x: number = 0, y: number = 0, turretRotation: number = 0, baseRotation: number = 0,
                          tankStats: TankStats = Constants.defaultTankStats, baseColor: string, turretColor: string) {

        this._base = new Rectangle(x, y, Constants.tankBaseWidth, Constants.tankBaseHeight, baseRotation, baseColor);
        this._turret = new Rectangle(x, y, Constants.tankTurretSize, Constants.tankTurretSize, turretRotation, turretColor);

        this._tankStats = tankStats;
        this._baseDesiredRotation = mod(baseRotation, 360);
        this._moving = false;
        this._baseRotationDirection = false;
    }

    protected get x(): number {
        return this._base.x;
    }

    protected get y(): number {
        return this._base.y;
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

    protected set baseRotation(desired: number) {
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

    protected set moving(moving: boolean) {
        this._moving = moving;
    }

    update(deltaTime: number): boolean {
        this.handleBaseRotationUpdate(deltaTime);
        this.handleBaseMovementUpdate(deltaTime);

        return true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._base.draw(ctx);
        this.drawTurretCannon(ctx);
        this._turret.draw(ctx);
    }

    private handleBaseRotationUpdate(deltaTime: number): void {
        if (this._baseDesiredRotation != this._base.rotation) {
            const direction = this._baseRotationDirection ? -1 : 1;
            this._base.rotate(direction * this._tankStats.rotationSpeed * deltaTime);

            if (shortestAngleDirection(this._baseDesiredRotation, this._base.rotation) != this._baseRotationDirection) {
                this._base.rotation = this._baseDesiredRotation;
            }
        }
    }

    private handleBaseMovementUpdate(deltaTime: number): void {
        if (this._moving && this._baseDesiredRotation == this._base.rotation) {
            const direction = degToPoint(this._base.rotation);
            direction.scale(this._tankStats.moveSpeed * deltaTime);
            this._base.translate_point(direction);
            this._turret.translate_point(direction);
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

}