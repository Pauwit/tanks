import {Window} from "../drawer/window.ts";
import {ImageManager} from "./imageManager.ts";

export class LoadingSpinner {
  private angle: number = 0; // in radians

  constructor(
    private x: number,
    private y: number,
    private width: number = ImageManager.LoadingIcon.width,
    private height: number = ImageManager.LoadingIcon.height,
    private speed: number = 1 // rotations per second
  ) {}

  update(deltaTime: number) {
    this.angle += deltaTime * this.speed * 2 * Math.PI;
    this.angle %= Math.PI * 2;
  }

  render() {
    const ctx = Window.Instance.ctx;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(ImageManager.LoadingIcon, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}