import {Logger} from "./misc/Logger.ts";
import {Drawer} from "./drawer/drawer.ts";
import {Window} from "./drawer/window.ts";
import {Mouse} from "./input/mouse.ts";
import {Keyboard} from "./input/keyboard.ts";
import {Gamepad} from "./input/gamepad.ts";
import {PlayerTank} from "./tank/playerTank.ts";
import {BulletManager} from "./bullet/bulletManager.ts";
import {MapManager} from "./map/mapManager.ts";
import {BombManager} from "./bomb/bombManager.ts";
import {ExplosionManager} from "./explosion/explosionManager.ts";
import {GameLoop} from "./loop.ts";
import {drawErrorOccurred, drawGettingLobbyInfo, drawWaitingForOtherPlayers} from "./misc/loadingUI.ts";
import {getLobby} from "../firebase/calls/getLobby.ts";
import {LobbyManager} from "./firebase/LobbyManager.ts";
import {sleep} from "./misc/misc.ts";

Logger.log("main", "Starting main...")

// Init canvas
const canvas = <HTMLCanvasElement>document.getElementById('canvas');
document.body.style.overflow = "hidden";
canvas.style.cursor = 'none';

// Init window
Drawer.Window.SetInstance(canvas,
    <HTMLElement>document.getElementById('fpsDisplay'),
    <HTMLElement>document.getElementById('deltaDisplay'));
const myWindow = Window.Instance;
myWindow.handleResize(canvas);
window.addEventListener('resize', () => myWindow.handleResize(canvas));

// Init inputs
Mouse.Instance;
Keyboard.Instance;
Gamepad.Instance;

// Test stuff for the map
// TEMP
const rect1 = new Drawer.Rectangle(1000, 1000, 1200, 200, 0);
const rect2 = new Drawer.Rectangle(400, 400, 100, 100, 45, "#f00");
const rect3 = new Drawer.Rectangle(800, 1600, 1600, 100, 0);
const c1 = new Drawer.Circle(1800, 600, 60, "#0f0");
const c2 = new Drawer.Circle(1800, 1200, 160, "#00f");

const player = new PlayerTank("0", 100, 100);
MapManager.add(rect1);
MapManager.add(rect2);
MapManager.add(c1);
MapManager.add(c2);
MapManager.add(rect3);

function startGameLoop() {
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

    GameLoop.Instance.start(update, render);
}

// Init Gameloop
// startGameLoop();


let hasRun = false;
export async function startLoading(lobbyId: string) {
    // TEMP
    if (hasRun) return;
    hasRun = true;

    drawGettingLobbyInfo();
    const lobby = await getLobby(lobbyId);
    if (lobby === null) {
        drawErrorOccurred();
        return;
    }
    Logger.log("main", "Got the following lobby :", lobby);
    LobbyManager.start(lobby);

    // TODO: Can be displayed in canvas while waiting
    drawWaitingForOtherPlayers();
    // startGameLoop()
}

// Exposes function. has to be done with a lot of cheat/debug functions once the multiplayer works
// @ts-ignore
window.testFunction = () => {
    console.log("This is a message.");
    console.log(LobbyManager.Instance.isOwner);
    return "test";
}