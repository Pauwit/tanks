import {Logger} from "./misc/Logger.ts";

Logger.log("main", "Starting main...")

document.body.style.overflow = "hidden";

const canvas = <HTMLCanvasElement>document.getElementById('canvas');

canvas.style.cursor = 'none';

import {Drawer} from "./drawer/drawer.ts";

Drawer.Window.SetInstance(canvas,
    <HTMLElement>document.getElementById('fpsDisplay'),
    <HTMLElement>document.getElementById('deltaDisplay'));


import {Window} from "./drawer/window.ts";
const myWindow = Window.Instance;
myWindow.handleResize(canvas);
window.addEventListener('resize', () => myWindow.handleResize(canvas));

import {Mouse} from "./input/mouse.ts";
import {Keyboard} from "./input/keyboard.ts";
import {Gamepad} from "./input/gamepad.ts";

Mouse.Instance;
Keyboard.Instance;
Gamepad.Instance;

const rect1 = new Drawer.Rectangle(500, 500, 600, 100, 0);
const rect2 = new Drawer.Rectangle(200, 200, 50, 50, 45, "#f00");
const rect3 = new Drawer.Rectangle(400, 800, 800, 50, 0);
const c1 = new Drawer.Circle(900, 300, 30, "#0f0");
const c2 = new Drawer.Circle(900, 600, 80, "#00f");

import {PlayerTank} from "./tank/playerTank.ts";
import {BulletManager} from "./bullet/bulletManager.ts";
import {MapManager} from "./map/mapManager.ts";
import {BombManager} from "./bomb/bombManager.ts";
import {ExplosionManager} from "./explosion/explosionManager.ts";

const player = new PlayerTank("0", 100, 100);
MapManager.add(rect1);
MapManager.add(rect2);
MapManager.add(c1);
MapManager.add(c2);
MapManager.add(rect3);

function render() : void {
    myWindow.clear();

    BulletManager.Instance.draw(myWindow.ctx);
    BombManager.Instance.draw(myWindow.ctx);
    player.draw(myWindow.ctx);
    MapManager.Instance.draw(myWindow.ctx);
    ExplosionManager.Instance.draw(myWindow.ctx);

    player.drawCrosshair();
}

function update(deltaTime: number) {
    rect1.rotate(50 * deltaTime);

    BulletManager.Instance.update(deltaTime);
    BombManager.Instance.update(deltaTime);
    ExplosionManager.Instance.update(deltaTime);
    player.update(deltaTime);

    player.applyCollision(MapManager.applyCollision(player.base));
}

import {GameLoop} from "./loop.ts";

GameLoop.Instance.start(update, render);
