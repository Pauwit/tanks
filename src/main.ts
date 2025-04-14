import {Window} from "./drawer/window.ts";

console.log("[main] LOG : Starting main...")

document.body.style.overflow = "hidden";

const canvas = <HTMLCanvasElement>document.getElementById('Canvas');

// canvas.style.cursor = 'none';

import {Audios, Images} from "./imports";

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

let rect1 = new Drawer.Rectangle(200, 200, 200, 100, 0);
let rect2 = new Drawer.Rectangle(200, 200, 10, 10, 45);
let c1 = new Drawer.Circle(600, 300, 30);

function render() : void {
    window.clear();

    rect1.draw(window.ctx);
    rect2.draw(window.ctx, "#f00");
    c1.draw(window.ctx, "#0f0");

    drawCrosshair(rect2.x, rect2.y);
}

let speed = 500;

function update(deltaTime: number) {
    rect1.rotate(50 * deltaTime);

    if (Keyboard.Instance.maintained("w"))
        rect2.translate(0, -speed * deltaTime);
    if (Keyboard.Instance.maintained("s"))
        rect2.translate(0, speed * deltaTime);
    if (Keyboard.Instance.maintained("a"))
        rect2.translate(-speed * deltaTime, 0);
    if (Keyboard.Instance.maintained("d"))
        rect2.translate(speed * deltaTime, 0);

    if (rectangleCollision(rect1, rect2))
        console.log("collision");
}

import {GameLoop} from "./loop";
import {rectangleCollision} from "./misc/collisions.ts";

GameLoop.Instance.start(update, render);
