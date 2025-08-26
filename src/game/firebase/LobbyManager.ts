import type {LobbyDataModel} from "../../firebase/models/lobbyDataModel.ts";
import {Firebase} from "../../firebase/firebase.ts";
import {defaultLobby} from "../../ui/components/LobbyDetails/LobbyDetails.tsx";

export class LobbyManager {
    private static _instance: LobbyManager = new LobbyManager();

    private _isOwner: boolean = false;
    private _lobby: LobbyDataModel = defaultLobby;

    private constructor() {

    }

    public static start(lobby: LobbyDataModel) {
        this._instance._isOwner = lobby.config.owner === Firebase.uid;
        this._instance._lobby = lobby;
    }

    public static get Instance(): LobbyManager {
        return this._instance;
    }

    public get isOwner(): boolean {
        return this._isOwner;
    }

    public get lobby(): LobbyDataModel {
        return this._lobby;
    }
}