import {Logger} from "./misc/Logger.ts";
import {Drawer} from "./drawer/drawer.ts";
import {Mouse} from "./input/mouse.ts";
import {Keyboard} from "./input/keyboard.ts";
import {Gamepad} from "./input/gamepad.ts";
import {GameLoop} from "./loop.ts";
import {startLoading} from "./firebase/startLoading.ts";
import {updatePosition} from "../firebase/calls/updatePosition.ts";
import {Firebase} from "../firebase/firebase.ts";
import {LobbyManager} from "./firebase/lobbyManager.ts";
import {listenToChildChange} from "../firebase/calls/listenToChildChange.ts";

Logger.log("main", "Starting main...")

// Init window
Drawer.Window.SetInstance(<HTMLCanvasElement>document.getElementById('canvas'),
    <HTMLElement>document.getElementById('deltaDisplay'),
    <HTMLElement>document.getElementById('fpsRenderDisplay'),
    <HTMLElement>document.getElementById('fpsUpdateDisplay')
);

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
    Logger.log(null, "Stopping Game Loop...");
    GameLoop.Instance.stop();
}

// @ts-expect-error TS2339
window.listenPos = () => {
    listenToChildChange(`lobbies/${LobbyManager.id}/game/players/`, (uid: string, data: any) => {
        Logger.log("listen", "uid:", uid, "data:", data);
    });
}

// @ts-expect-error TS2339
window.updatePos = async () => {
    Logger.log("updatePos", "Sending request...");
    await updatePosition(LobbyManager.id, Firebase.uid, 10, 11, 12, 13);
    Logger.log("updatePos", "Send");
}


