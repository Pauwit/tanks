import type {LobbyDataModel} from "../../firebase/models/lobbyDataModel.ts";
import {Firebase} from "../../firebase/firebase.ts";
import {defaultLobby} from "../../ui/components/LobbyDetails/LobbyDetails.tsx";
import {LobbyWaitingState} from "../enums/lobbyWaitingState.ts";

export class LobbyManager {
    private static _instance: LobbyManager = new LobbyManager();

    private _isOwner: boolean = false;
    private _lobby: LobbyDataModel = defaultLobby;
    private _waitingState: LobbyWaitingState;

    private constructor() {
        this._waitingState = LobbyWaitingState.None;
    }

    public static start(lobby: LobbyDataModel) {
        this.Instance._isOwner = lobby.config.owner === Firebase.uid;
        this.Instance._lobby = lobby;
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

    public get waitingState(): LobbyWaitingState {
        return this._waitingState;
    }

    public set waitingState(value: LobbyWaitingState) {
        this._waitingState = value;
    }
}