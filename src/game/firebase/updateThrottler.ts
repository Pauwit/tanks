import {type DatabaseReference, ref, update} from "firebase/database";
import {Firebase} from "../../firebase/firebase.ts";
import {Logger} from "../misc/Logger.ts";

export class UpdateThrottler {
    private _lastUpdateTime: number = 0;
    private readonly _reference: DatabaseReference;
    private readonly _throttleTime: number;

    constructor(path: string, throttleTime: number) {
        this._reference = ref(Firebase.db, path);
        this._throttleTime = throttleTime;
    }

    public tryUpdate(data: Record<string, any>): void {
        const now = Date.now();
        if (now - this._lastUpdateTime < this._throttleTime) return;

        this._lastUpdateTime = now;

        // Clean undefined fields
        const cleanData: Record<string, any> = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) cleanData[key] = value;
        }

        update(this._reference, data);
    }
}