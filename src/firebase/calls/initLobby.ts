import { ref, update } from "firebase/database";
import {Firebase} from "../firebase.ts";
import {Logger} from "../../game/misc/Logger.ts";
import type {LobbyDataModel} from "../models/lobbyDataModel.ts";
import type {LobbyGameModel} from "../models/lobbyGameModel.ts";
import type {GamePlayerModel} from "../models/gamePlayerModel.ts";
import {defaultBullet} from "../models/gameBulletModel.ts";
import {defaultMine} from "../models/gameMineModel.ts";
import {defaultExplosion} from "../models/gameExplosionModel.ts";

export async function initLobby(lobbyId: string, lobby: LobbyDataModel): Promise<boolean> {
    if (Firebase.uid !== lobby.config.owner) {
        Logger.error("lobby", "Player must be the owner to initialize the lobby");
        return false;
    }

    const lobbyGameRef = ref(Firebase.db, `lobbies/${lobbyId}/game`);

    // Init the lobby
    const currentPlayerObject: GamePlayerModel = {
        dead: false,
        position: { x: 0, y: 0 },
        rotation: 0,
        look: 0
    }

    const gameObject: LobbyGameModel = {
        players: {
            [Firebase.uid]: currentPlayerObject
        },
        bullets: {
            //[-1]: defaultBullet
        },
        mines: {
            //[-1]: defaultMine
        },
        explosions: {
            //[-1]: defaultExplosion
        }
    };

    try {
        await update(lobbyGameRef, gameObject);
        Logger.log("lobby", "Initialized the lobby successfully");
        return true;
    } catch (error) {
        Logger.error("lobby", "Failed to initialize lobby :", error);
        return false;
    }
}
