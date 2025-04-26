import {Window} from "./drawer/window.ts";

console.log("[main] LOG : Starting main...")

document.body.style.overflow = "hidden";

const canvas = <HTMLCanvasElement>document.getElementById('Canvas');

canvas.style.cursor = 'none';

import {Images} from "./misc/imports";

Images.importImages();

import {Drawer} from "./drawer/drawer";

Drawer.Window.SetInstance(canvas,
    <HTMLElement>document.getElementById('fpsDisplay'),
    <HTMLElement>document.getElementById('deltaDisplay'));

let window = Window.Instance;

import {Mouse} from "./input/mouse";
import {Keyboard} from "./input/keyboard";

Mouse.Instance;
Keyboard.Instance;

let rect1 = new Drawer.Rectangle(500, 500, 600, 100, 0);
let rect2 = new Drawer.Rectangle(200, 200, 50, 50, 45, "#f00");
let rect3 = new Drawer.Rectangle(400, 800, 800, 50, 0);
let c1 = new Drawer.Circle(900, 300, 30, "#0f0");
let c2 = new Drawer.Circle(900, 600, 80, "#00f");

import {PlayerTank} from "./tank/playerTank.ts";
import {BulletManager} from "./bullet/bulletManager.ts";

let player = new PlayerTank("0", 100, 100);
MapManager.add(rect1);
MapManager.add(rect2);
MapManager.add(c1);
MapManager.add(c2);
MapManager.add(rect3);

function render() : void {
    window.clear();

    player.draw(window.ctx);
    MapManager.Instance.draw(window.ctx);
    BulletManager.Instance.draw(window.ctx);

    player.drawCrosshair();
}

function update(deltaTime: number) {
    rect1.rotate(50 * deltaTime);

    BulletManager.Instance.update(deltaTime);
    player.update(deltaTime);

    player.applyCollision(MapManager.applyCollision(player.base));
}

import {GameLoop} from "./loop";
import {MapManager} from "./map/mapManager.ts";

GameLoop.Instance.start(update, render);
