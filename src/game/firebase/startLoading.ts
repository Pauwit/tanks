import type {LobbyDataModel} from "../../firebase/models/lobbyDataModel.ts";
import {LobbyManager} from "./lobbyManager.ts";
import {LobbyWaitingState} from "../enums/lobbyWaitingState.ts";
import {initLobby} from "../../firebase/calls/initLobby.ts";
import {showError} from "../../ui/components/ErrorContext/errorStore.ts";
import {setStatus} from "../../firebase/calls/setStatus.ts";
import {LobbyStatus} from "../enums/lobbyStatus.ts";
import {Logger} from "../misc/Logger.ts";
import {sleep} from "../misc/misc.ts";
import {getGamePlayers} from "../../firebase/calls/getGamePlayers.ts";
import {startGameLoop, startLoadingLoop} from "../drawer/loops.ts";
import {registerPlayerToGame} from "../../firebase/calls/registerPlayerToGame.ts";
import {getStatus} from "../../firebase/calls/getStatus.ts";
import {getLobby} from "../../firebase/calls/getLobby.ts";
import {TestExistence} from "../../firebase/calls/testExistence.ts";
import {Firebase} from "../../firebase/firebase.ts";

export async function handleOwner(lobbyId: string, lobby: LobbyDataModel) {
    LobbyManager.waitingState = LobbyWaitingState.InitializingGame;

    if (!(await initLobby(lobbyId, lobby))) {
        showError("The game couldn't get initialized");
        LobbyManager.waitingState = LobbyWaitingState.Error;
        await setStatus(lobbyId, LobbyStatus.Error);
        return;
    }

    LobbyManager.waitingState = LobbyWaitingState.WaitingForPlayers;

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
            LobbyManager.waitingState = LobbyWaitingState.Error;
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
        LobbyManager.waitingState = LobbyWaitingState.Error;
        await setStatus(lobbyId, LobbyStatus.Error);
        return;
    }

    // Start game
    Logger.log("game", "Starting game...");
    LobbyManager.waitingState = LobbyWaitingState.None;
    startGameLoop();
}

export async function handlePlayer(lobbyId: string, lobby: LobbyDataModel) {
    LobbyManager.waitingState = LobbyWaitingState.WaitingForOwner;

    // Waits for owner to initialize game
    let counter = 0;
    const timeout = 5000;
    let wait = 500;
    while (!(await registerPlayerToGame(lobbyId))) {
        if (counter >= timeout) {
            showError("Could not register to the game");
            LobbyManager.waitingState = LobbyWaitingState.Error;
            return;
        }
        await sleep(wait);
        counter += wait;
    }

    LobbyManager.waitingState = LobbyWaitingState.WaitingForPlayers;

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
        LobbyManager.waitingState = LobbyWaitingState.Error;
        return;
    }

    // Start game
    Logger.log("game", "Starting game...");
    LobbyManager.waitingState = LobbyWaitingState.None;
    startGameLoop();
}

export async function startLoading(lobbyId: string) {
    LobbyManager.waitingState = LobbyWaitingState.InitializingCanvas;

    // Init GameLoop
    startLoadingLoop();

    // Getting lobby info
    LobbyManager.waitingState = LobbyWaitingState.GettingLobbyInfo;
    const lobby = await getLobby(lobbyId);
    if (lobby === null) {
        LobbyManager.waitingState = LobbyWaitingState.Error;
        return;
    }
    Logger.log("main", "Got the following lobby :", lobby);
    LobbyManager.start(lobbyId, lobby);

    // Verify if game was already started and player correctly joined
    if (await TestExistence(`lobbies/${lobbyId}/game/players/${Firebase.uid}`)) {
        Logger.log("game", "Game already started");
        LobbyManager.waitingState = LobbyWaitingState.None;

        // Retrieve previous infos
        const player = lobby.game!.players[Firebase.uid]!;
        startGameLoop(player);
        return;
    }

    if (LobbyManager.isOwner) {
        await handleOwner(lobbyId, lobby);
    } else {
        await handlePlayer(lobbyId, lobby);
    }
}