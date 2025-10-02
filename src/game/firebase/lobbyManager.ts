import type {LobbyDataModel} from "../../firebase/models/lobbyDataModel.ts";
import {Firebase} from "../../firebase/firebase.ts";
import {defaultLobby} from "../../ui/components/LobbyDetails/LobbyDetails.tsx";
import {LobbyWaitingState} from "../enums/lobbyWaitingState.ts";

export class LobbyManager {
    private static _instance: LobbyManager = new LobbyManager();

    private _isOwner: boolean = false;
    private _lobby: LobbyDataModel = defaultLobby;
    private _waitingState: LobbyWaitingState;
    private _id: string = "0";

    private constructor() {
        this._waitingState = LobbyWaitingState.None;
    }

    public static start(lobbyId: string, lobby: LobbyDataModel) {
        this.Instance._isOwner = lobby.config.owner === Firebase.uid;
        this.Instance._lobby = lobby;
        this.Instance._id = lobbyId;
    }

    public static get Instance(): LobbyManager {
        return this._instance;
    }

    public static get isOwner(): boolean {
        return this.Instance._isOwner;
    }

    public static get lobby(): LobbyDataModel {
        return this.Instance._lobby;
    }

    public static get waitingState(): LobbyWaitingState {
        return this.Instance._waitingState;
    }

    public static get id(): string {
        return this.Instance._id;
    }

    public static set waitingState(value: LobbyWaitingState) {
        this.Instance._waitingState = value;
    }
}