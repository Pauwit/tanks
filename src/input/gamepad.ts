
export class Gamepad {
    private static instance: Gamepad = new Gamepad();

    private _pressed : any = {};
    private _maintained : any = {};
    private _nbGamepads : number = 0;

    private constructor() {
        globalThis.window.addEventListener("gamepadconnected", (e) => {
            console.log(
                "[Gamepad] LOG : Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length,
            );
            this._nbGamepads++;
        });

        globalThis.window.addEventListener("gamepaddisconnected", (e) => {
            console.log(
                "[Gamepad] LOG : Gamepad disconnected from index %d: %s",
                e.gamepad.index,
                e.gamepad.id,
            );
            this._nbGamepads--;
        });
    }

    public static get Instance(): Gamepad {
        return this.instance;
    }
}