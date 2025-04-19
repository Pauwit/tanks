import {Window} from "./drawer/window.ts";

console.log("[main] LOG : Starting main...")

document.body.style.overflow = "hidden";

const canvas = <HTMLCanvasElement>document.getElementById('Canvas');

canvas.style.cursor = 'none';

import {Audios, Images} from "./misc/imports";

Images.importImages();
Audios.importAudio();

// Put in different file and research better main loop

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

function render() : void {
    window.clear();

    rect1.draw(window.ctx);
    rect2.draw(window.ctx, "#f00");
    c1.draw(window.ctx, "#0f0");
    c2.draw(window.ctx, "#00f");

    drawCrosshair(rect2.x, rect2.y);
}

import {rectangleCollision, rectangleCircleCollision} from "./misc/collisions.ts";

let speed = 500;

function update(deltaTime: number) {
    rect1.rotate(50 * deltaTime);

    let vector = new Drawer.Point();
    if (Keyboard.Instance.maintained("z"))
        vector.y += -1;
    if (Keyboard.Instance.maintained("s"))
        vector.y += 1;
    if (Keyboard.Instance.maintained("q"))
        vector.x += -1;
    if (Keyboard.Instance.maintained("d"))
        vector.x += 1;
    const len = Math.hypot(vector.x, vector.y);
    if (len != 0)
        rect2.translate(speed * deltaTime * vector.x / len, speed * deltaTime * vector.y / len);

    let mtv = rectangleCollision(rect2, rect1);
    if (mtv != null) {
        rect2.translate_point(mtv);
    }

    if ((mtv = rectangleCircleCollision(rect2, c1)) != null) {
        rect2.translate_point(mtv);
    }

    if ((mtv = rectangleCircleCollision(rect2, c2)) != null) {
        rect2.translate_point(mtv);
    }
}

import {GameLoop} from "./loop";

GameLoop.Instance.start(update, render);
