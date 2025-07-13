
export class Keyboard {
    private static instance: Keyboard = new Keyboard();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _pressed : any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _maintained : any = {};

    private constructor() {
        document.addEventListener('keydown', this.onDown);
        document.addEventListener('keyup', this.onUp);
    }

    public static get Instance(): Keyboard {
        return this.instance;
    }

    private onUp(e: KeyboardEvent): void {
        Keyboard.instance._maintained[e.key] = false;
    }

    private onDown(e: KeyboardEvent): void {
        Keyboard.instance._pressed[e.key] = true;
        Keyboard.instance._maintained[e.key] = true;
    }

    public resetKeyboard(): void {
        this._pressed = {};
    }

    public maintained(key: string): boolean {
        return this._maintained[key];
    }

    public pressed(key: string): boolean {
        return this._pressed[key];
    }
}