import * as DrawerWindow from "./window"
import * as DrawerShape from "./shape"
import * as DrawerRectangle from "./rectangle"
import * as DrawerCircle from "./circle"

export const Drawer = {
    ...DrawerWindow,
    ...DrawerShape,
    ...DrawerRectangle,
    ...DrawerCircle,
};

import {Images} from "../imports";
import {Window} from "./window";
import {Mouse} from "../input/mouse";

// Draws the crosshair with the dots
export function drawCrosshair(pX: number, pY: number): void {
    let ctx = Window.Instance.ctx;
    let c_dot = Images.crosshair_dot;
    let x = Mouse.Instance.x;
    let y = Mouse.Instance.y;

    ctx.globalAlpha = 0.6;
    ctx.drawImage(c_dot, pX+(x-pX)*0.2-10, pY+(y-pY)*0.2-10, 20, 20);
    ctx.drawImage(c_dot, pX+(x-pX)*0.4-10, pY+(y-pY)*0.4-10, 20, 20);
    ctx.drawImage(c_dot, pX+(x-pX)*0.6-10, pY+(y-pY)*0.6-10, 20, 20);
    ctx.drawImage(c_dot, pX+(x-pX)*0.8-10, pY+(y-pY)*0.8-10, 20, 20);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(Images.crosshair, x-30, y-30);
    ctx.globalAlpha = 1;
}