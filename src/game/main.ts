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
import {drawText} from "./drawer/drawMisc.ts";
import {getLobby} from "../firebase/calls/getLobby.ts";
import {LobbyManager} from "./firebase/LobbyManager.ts";
import {LobbyWaitingState} from "./enums/lobbyWaitingState.ts";
import {LoadingSpinner} from "./misc/LoadingSpinner.ts";
import {sleep} from "./misc/misc.ts";
import {initLobby} from "../firebase/calls/initLobby.ts";
import {registerPlayerToGame} from "../firebase/calls/registerPlayerToGame.ts";
import {showError} from "../ui/components/ErrorContext/errorStore.ts";
import type {LobbyDataModel} from "../firebase/models/lobbyDataModel.ts";
import {getGamePlayers} from "../firebase/calls/getGamePlayers.ts";
import {setStatus} from "../firebase/calls/setStatus.ts";
import {LobbyStatus} from "./enums/lobbyStatus.ts";
import {getStatus} from "../firebase/calls/getStatus.ts";

Logger.log("main", "Starting main...")

// Init window
Drawer.Window.SetInstance(<HTMLCanvasElement>document.getElementById('canvas'),
    <HTMLElement>document.getElementById('fpsDisplay'),
    <HTMLElement>document.getElementById('deltaDisplay'));

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
MapManager.add(rect1);
MapManager.add(rect2);
MapManager.add(c1);
MapManager.add(c2);
MapManager.add(rect3);

const player = new PlayerTank("0", 100, 100);

function startGameLoop() {
    GameLoop.Instance.stop();

    function render() : void {
        Window.Instance.clear();

        BulletManager.Instance.draw(Window.Instance.ctx);
        BombManager.Instance.draw(Window.Instance.ctx);
        player.draw(Window.Instance.ctx);
        MapManager.Instance.draw(Window.Instance.ctx);
        ExplosionManager.Instance.draw(Window.Instance.ctx);

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

function startLoadingLoop() {
    const spinner: LoadingSpinner = new LoadingSpinner(
      Window.Instance.windowWidth / 2,
      Window.Instance.windowHeight / 2 + 100,
    );

    function render() : void {
        Window.Instance.clear();

        drawText(LobbyManager.Instance.waitingState.toString(),
          Window.Instance.windowWidth / 2,
          Window.Instance.windowHeight / 2,
          60, "#ffffff"
        );

        if (LobbyManager.Instance.waitingState !== LobbyWaitingState.Error) {
            spinner.render();
        }
    }

    function update(deltaTime: number) {
        spinner.update(deltaTime);
    }

    GameLoop.Instance.start(update, render);
}

async function handleOwner(lobbyId: string, lobby: LobbyDataModel) {
    LobbyManager.Instance.waitingState = LobbyWaitingState.InitializingGame;

    if (!(await initLobby(lobbyId, lobby))) {
        showError("The game couldn't get initialized");
        LobbyManager.Instance.waitingState = LobbyWaitingState.Error;
        await setStatus(lobbyId, LobbyStatus.Error);
        return;
    }

    LobbyManager.Instance.waitingState = LobbyWaitingState.WaitingForPlayers;

    // Waits for all players to join
    const awaitedCount = lobby.players.length;
    let currentCount = 0;
    const timeout = 5000; // 5s
    const wait = 500;
    let counter = 0;
    do {
        if (counter >= timeout) {
            Logger.error("game", "Players took too long to join")
            showError("Players took too long to join");
            LobbyManager.Instance.waitingState = LobbyWaitingState.Error;
            await setStatus(lobbyId, LobbyStatus.Error);
            return;
        }
        await sleep(wait);
        counter += wait;

        const players = await getGamePlayers(lobbyId);
        currentCount = Object.keys(players).length;
    } while (currentCount < awaitedCount);

    // Change game status
    if (!(await setStatus(lobbyId, LobbyStatus.Started))) {
        showError("Could not change lobby status");
        LobbyManager.Instance.waitingState = LobbyWaitingState.Error;
        await setStatus(lobbyId, LobbyStatus.Error);
        return;
    }

    // Start game
    Logger.log("game", "Starting game...");
    LobbyManager.Instance.waitingState = LobbyWaitingState.None;
    startGameLoop();
}

async function handlePlayer(lobbyId: string, lobby: LobbyDataModel) {
    LobbyManager.Instance.waitingState = LobbyWaitingState.WaitingForOwner;

    // Waits for owner to initialize game
    let counter = 0;
    const timeout = 5000;
    let wait = 500;
    while (!(await registerPlayerToGame(lobbyId))) {
        if (counter >= timeout) {
            showError("Could not register to the game");
            LobbyManager.Instance.waitingState = LobbyWaitingState.Error;
            return;
        }
        await sleep(wait);
        counter += wait;
    }

    LobbyManager.Instance.waitingState = LobbyWaitingState.WaitingForPlayers;

    // Test game status
    counter = 0;
    wait = 100;
    while (counter < timeout) {
        const status = await getStatus(lobbyId);
        if (status !== LobbyStatus.Started) {
            await sleep(wait);
            counter += wait;
        } else {
            break;
        }
    }

    if (counter >= timeout) {
        Logger.error("game", "Players took too long to join")
        showError("Players took too long to join");
        LobbyManager.Instance.waitingState = LobbyWaitingState.Error;
        return;
    }

    // Start game
    Logger.log("game", "Starting game...");
    LobbyManager.Instance.waitingState = LobbyWaitingState.None;
    startGameLoop();
}

let hasRun = false;
export async function startLoading(lobbyId: string) {
    // Ensures the game is started only once
    if (hasRun) return;
    hasRun = true;

    LobbyManager.Instance.waitingState = LobbyWaitingState.InitializingCanvas;

    // Init GameLoop
    startLoadingLoop();

    // Getting lobby info
    LobbyManager.Instance.waitingState = LobbyWaitingState.GettingLobbyInfo;
    const lobby = await getLobby(lobbyId);
    if (lobby === null) {
        LobbyManager.Instance.waitingState = LobbyWaitingState.Error;
        return;
    }
    Logger.log("main", "Got the following lobby :", lobby);
    LobbyManager.start(lobby);

    if (LobbyManager.Instance.isOwner) {
        handleOwner(lobbyId, lobby);
    } else {
        handlePlayer(lobbyId, lobby);
    }
}

// Exposed functions
// TODO: Has to be done with a lot of cheat/debug functions once the multiplayer works
// @ts-ignore
window.stopGameLoop = () => {
    Logger.log(null, "Stopping Game Loop...")
    GameLoop.Instance.stop();
}