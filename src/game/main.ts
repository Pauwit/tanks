import {Logger} from "./misc/Logger.ts";
import {Drawer} from "./drawer/drawer.ts";
import {Mouse} from "./input/mouse.ts";
import {Keyboard} from "./input/keyboard.ts";
import {Gamepad} from "./input/gamepad.ts";
import {GameLoop} from "./loop.ts";
import {startLoading} from "./firebase/startLoading.ts";

Logger.log("main", "Starting main...")

// Init window
Drawer.Window.SetInstance(<HTMLCanvasElement>document.getElementById('canvas'),
    <HTMLElement>document.getElementById('fpsDisplay'),
    <HTMLElement>document.getElementById('deltaDisplay'));

// Init inputs
Mouse.Instance;
Keyboard.Instance;
Gamepad.Instance;

// ----------------------------------------------------------------------------

// First function to execute
let hasRun = false;
export async function main(lobbyId: string) {
    // Ensures the game is started only once
    if (hasRun) return;
    hasRun = true;

    await startLoading(lobbyId);
}

// ----------------------------------------------------------------------------

// Exposed functions
// TODO: Has to be done with a lot of cheat/debug functions once the multiplayer works
// @ts-expect-error TS2339
window.stopGameLoop = () => {
    Logger.log(null, "Stopping Game Loop...")
    GameLoop.Instance.stop();
}