import * as DrawerWindow from "./window.ts"
import * as DrawerShape from "./shape.ts"
import * as DrawerRectangle from "./rectangle.ts"
import * as DrawerCircle from "./circle.ts"
import * as DrawerPoint from "./point.ts"

export const Drawer = {
    ...DrawerWindow,
    ...DrawerShape,
    ...DrawerRectangle,
    ...DrawerCircle,
    ...DrawerPoint,
};

import {ImageManager} from "../misc/imageManager.ts";
import {Window} from "./window.ts";
import {Mouse} from "../input/mouse.ts";

// Draws the crosshair with the dots
export function drawCrosshair(pX: number, pY: number): void {
    const ctx = Window.Instance.ctx;
    const c_dot = ImageManager.crosshairDot;
    const x = Mouse.Instance.x;
    const y = Mouse.Instance.y;

    ctx.globalAlpha = 0.6;
    ctx.drawImage(c_dot, pX+(x-pX)*0.2-15, pY+(y-pY)*0.2-15, 30, 30);
    ctx.drawImage(c_dot, pX+(x-pX)*0.4-15, pY+(y-pY)*0.4-15, 30, 30);
    ctx.drawImage(c_dot, pX+(x-pX)*0.6-15, pY+(y-pY)*0.6-15, 30, 30);
    ctx.drawImage(c_dot, pX+(x-pX)*0.8-15, pY+(y-pY)*0.8-15, 30, 30);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(ImageManager.crosshair, x-45, y-45, 90, 90);
    ctx.globalAlpha = 1;
}