import { MapManager } from "../map/mapManager";
import { PlayerTank } from "../tank/playerTank";
import { Drawer } from "./drawer.ts";
import {GameLoop} from "../loop.ts";
import {Window} from "./window.ts";
import { BulletManager } from "../bullet/bulletManager.ts";
import {BombManager} from "../bomb/bombManager.ts";
import {ExplosionManager} from "../explosion/explosionManager.ts";
import { LoadingSpinner } from "../misc/LoadingSpinner.ts";
import {drawText} from "./drawMisc.ts";
import {LobbyManager} from "../firebase/lobbyManager.ts";
import {LobbyWaitingState} from "../enums/lobbyWaitingState.ts";
import {EnemyTank} from "../tank/enemyTank.ts";
import {Firebase} from "../../firebase/firebase.ts";
import type {GamePlayerModel} from "../../firebase/models/gamePlayerModel.ts";
import {Constants} from "../constants.ts";

// Main game loop
export function startGameLoop(playerLobby: GamePlayerModel = Constants.defaultPlayer) {
    GameLoop.Instance.stop();

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

    const player = new PlayerTank(Firebase.uid, playerLobby.position.x, playerLobby.position.y, playerLobby.turretRotation, playerLobby.baseRotation);
    const enemies: EnemyTank[] = [];
    for (const p of LobbyManager.lobby.players) {
        if (p.uid === Firebase.uid) continue;
        const pGame = LobbyManager.lobby.game?.players[p.uid];
        if (pGame === undefined) {
            enemies.push(new EnemyTank(p.uid));
        } else {
            // Init other players with their infos
            enemies.push(new EnemyTank(p.uid, pGame.position.x, pGame.position.y, pGame.turretRotation, pGame.baseRotation, Constants.defaultTankStats, pGame.dead));
        }
    }

    function render() : void {
        Window.Instance.clear();

        BulletManager.Instance.draw(Window.Instance.ctx);
        BombManager.Instance.draw(Window.Instance.ctx);
        player.draw(Window.Instance.ctx);
        MapManager.Instance.draw(Window.Instance.ctx);
        ExplosionManager.Instance.draw(Window.Instance.ctx);
        for (const enemy of enemies) {
            enemy.draw(Window.Instance.ctx);
        }

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

// Start of game loading (syncing etc.)
export function startLoadingLoop() {
    GameLoop.Instance.stop();

    const spinner: LoadingSpinner = new LoadingSpinner(
        Window.Instance.windowWidth / 2,
        Window.Instance.windowHeight / 2 + 100,
    );

    function render() : void {
        Window.Instance.clear();

        drawText(LobbyManager.waitingState.toString(),
            Window.Instance.windowWidth / 2,
            Window.Instance.windowHeight / 2,
            60, "#ffffff"
        );

        if (LobbyManager.waitingState !== LobbyWaitingState.Error) {
            spinner.render();
        }
    }

    function update(deltaTime: number) {
        spinner.update(deltaTime);
    }

    GameLoop.Instance.start(update, render);
}