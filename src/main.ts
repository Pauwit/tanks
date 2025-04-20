import {Window} from "./drawer/window.ts";

console.log("[main] LOG : Starting main...")

document.body.style.overflow = "hidden";

const canvas = <HTMLCanvasElement>document.getElementById('Canvas');

canvas.style.cursor = 'none';

import {Audios, Images} from "./misc/imports";

Images.importImages();
Audios.importAudio();

import {Drawer, drawCrosshair} from "./drawer/drawer";

Drawer.Window.SetInstance(canvas,
    <HTMLElement>document.getElementById('fpsDisplay'),
    <HTMLElement>document.getElementById('deltaDisplay'));

let window = Window.Instance;

import {Mouse} from "./input/mouse";
import {Keyboard} from "./input/keyboard";

Mouse.Instance;
Keyboard.Instance;

let rect1 = new Drawer.Rectangle(500, 500, 600, 100, 0);
let rect2 = new Drawer.Rectangle(200, 200, 50, 50, 45);
let c1 = new Drawer.Circle(900, 300, 30);
let c2 = new Drawer.Circle(900, 600, 80);

import {PlayerTank} from "./tank/playerTank.ts";
import {Point} from "./drawer/point.ts";
import {Rectangle} from "./drawer/rectangle.ts";
import {isCircle} from "./misc/cast.ts";
import {Circle} from "./drawer/circle.ts";

let player = new PlayerTank(100, 100);

function render() : void {
    window.clear();

    rect1.draw(window.ctx);
    rect2.draw(window.ctx, "#f00");
    c1.draw(window.ctx, "#0f0");
    c2.draw(window.ctx, "#00f");

    player.draw(window.ctx);

    player.drawCrosshair();
}

import {rectangleCollision, rectangleCircleCollision} from "./misc/collisions.ts";

const shapes = [rect1, rect2, c1, c2];

function update(deltaTime: number) {
    rect1.rotate(50 * deltaTime);

    player.update(deltaTime);

    let mtv: Point | null = null;
    for (let i = 0; i < shapes.length; i++) {
        if (isCircle(shapes[i])) {
            mtv = rectangleCircleCollision(player.base, shapes[i] as Circle);
        } else { // Supposes there are only Circles and Rectangles
            mtv = rectangleCollision(player.base, shapes[i] as Rectangle);
        }

        if (mtv != null) {
            player.applyCollision(mtv);
        }
    }
}

import {GameLoop} from "./loop";

GameLoop.Instance.start(update, render);
