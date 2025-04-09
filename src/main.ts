
console.log("[main] LOG : Starting main...")

document.body.style.overflow = "hidden";

const canvas = <HTMLCanvasElement>document.getElementById('Canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

// canvas.style.cursor = 'none';

import {Audios, Images} from "./imports.js";

Images.importImages();
Audios.importAudio();

// Put in different file and research better main loop

let lastFrameTimeMs = 0;
let maxFPS = 145;
let delta = 0;
let fps = 144;                   //144
let timestep = 1000 / fps;
let framesThisSecond = 0;
let lastFpsUpdate = 0;

function panic() {
    delta = 0;
}
function mainLoop(timestamp : number) {
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    if (timestamp > lastFpsUpdate + 1000) {
        fps = framesThisSecond; //+ 0.5 * fps;

        lastFpsUpdate = timestamp;
        framesThisSecond = 0;
    }
    framesThisSecond++;

    let numUpdateSteps = 0;
    while (delta >= timestep) {
        // begin();
        // update(timestep);
        delta -= timestep;
        if (++numUpdateSteps >= 240) {
            panic();
            break;
        }
    }
    // draw(timestep);
    requestAnimationFrame(mainLoop);
}

// @ts-ignore
window.onload = requestAnimationFrame(mainLoop);
