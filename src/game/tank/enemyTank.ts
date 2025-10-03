import {Tank} from "./tank.ts";
import type {TankStats} from "./tankStats.ts";
import {Constants} from "../constants.ts";
import {listenToChildChange} from "../../firebase/calls/listenToChildChange.ts";
import {LobbyManager} from "../firebase/lobbyManager.ts";
import {Logger} from "../misc/Logger.ts";

export class EnemyTank extends Tank {

    constructor(id: string, x: number = 0, y: number = 0, turretRotation: number = 0, baseRotation: number = 0,
                tankStats: TankStats = Constants.defaultTankStats, dead = false) {
        super(id, x, y, turretRotation, baseRotation, tankStats, Constants.enemyTankBaseColor, Constants.enemyTankTurretColor, dead); // wheels: "#4d0000"
        listenToChildChange(`lobbies/${LobbyManager.id}/game/players/${id}`, (uid, param, data) => this.onChange(uid, param, data));
        Logger.log(null, "init");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onChange(uid: string, param: string, data: any) {
        //Logger.log("onChange", "uid:", uid, "param:", param, "data:", data);
        switch (param) {
            case "position":
                this.x = data.x;
                this.y = data.y;
                break;
            case "turretRotation":
                this.turretRotation = data;
                break;
            case "baseRotation":
                this.baseRotation = data;
                break;
            case "dead":
                this._dead = data;
                break;
            default:
                Logger.error("EnemyTank", "Got unknown parameter from firebase. Name:", param, "; value:", data);
                break;
        }
    }

    override update(deltaTime: number): boolean {
        return true;
    }
}