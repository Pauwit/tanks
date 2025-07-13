
export class ImageManager {
    private readonly PATH_IMAGES : string = "/public/images/";

    private static instance : ImageManager = new ImageManager();

    private readonly _background = new Image();
    private readonly _wall = new Image();
    private readonly _wallAlt = new Image();
    private readonly _wallDest = new Image();
    private readonly _crosshair = new Image();
    private readonly _crosshairDot = new Image();
    private readonly _playerDeath = new Image();

    private constructor() {
        this.importImages();
    }

    public static get Instance(): ImageManager {
        return this.instance;
    }

    public static get background() {
        return this.Instance._background;
    }

    public static get wall() {
        return this.Instance._wall;
    }

    public static get wallAlt() {
        return this.Instance._wallAlt;
    }

    public static get wallDest() {
        return this.Instance._wallDest;
    }

    public static get crosshair() {
        return this.Instance._crosshair;
    }

    public static get crosshairDot() {
        return this.Instance._crosshairDot;
    }

    public static get playerDeath() {
        return this.Instance._playerDeath;
    }

    private importImages() : void {
        console.log("[LOG] ImageManager - Importing images...");

        this._background.src = this.imagePath("background.png");
        this._wall.src = this.imagePath("wall1.png");
        this._wallAlt.src = this.imagePath("wall2.png");
        this._wallDest.src = this.imagePath("wall_dest.png");
        this._crosshair.src = this.imagePath("aim.png");
        this._crosshairDot.src = this.imagePath("aimdot.png");
        this._playerDeath.src = this.imagePath("playerDeath.png");

        console.log("[LOG] ImageManager - Finished importing images");
    }

    private imagePath(name : string) : string {
        return this.PATH_IMAGES + name;
    }
}
