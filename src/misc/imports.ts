
export namespace Images {
    const path_images : string = "../misc/images/";

    export const background = new Image();
    export const wall = new Image();
    export const wall_alt = new Image();
    export const wall_dest = new Image();
    export const crosshair = new Image();
    export const crosshair_dot = new Image();

    export function importImages() : void {
        console.log("[imports] LOG : Importing images...");

        background.src = imagePath("background.png");
        wall.src = imagePath("wall1.png");
        wall_alt.src = imagePath("wall2.png");
        wall_dest.src = imagePath("wall_dest.png");
        crosshair.src = imagePath("aim.png");
        crosshair_dot.src = imagePath("aimdot.png");

        console.log("[imports] LOG : Finished importing images");
    }

    function imagePath(name : string) {
        return path_images + name;
    }
}

export namespace Audios {
    const path_audio : string = "../misc/audio/";

    export const moveSound = new Audio();
    export const destroyedBullet = new Audio();
    export const bounceBullet = new Audio();
    export const shoot1 = new Audio();
    export const bombPlace = new Audio();
    export const bombBip = new Audio();
    export const explosion = new Audio();
    export const destroy = new Audio();

    export function importAudio() : void {
        console.log("[imports] LOG : Importing audio...");

        moveSound.src = audioPath("move.wav");
        destroyedBullet.src = audioPath("bullet_des.wav");
        bounceBullet.src = audioPath("bounce.wav");
        shoot1.src = audioPath("bullet_shoot1.wav");
        bombPlace.src = audioPath("bomb_place.wav");
        bombBip.src = audioPath("bomb_bip.wav");
        explosion.src = audioPath("explosion.wav");
        destroy.src = audioPath("destroy.wav");

        moveSound.volume = 0.1;
        destroyedBullet.volume = 0.5;
        bounceBullet.volume = 0.5;
        shoot1.volume = 0.5;
        bombPlace.volume = 0.3;
        bombBip.volume = 0.3;
        explosion.volume = 0.5;
        destroy.volume = 0.4;

        console.log("[imports] LOG : Finished importing audio");
    }

    function audioPath(name : string) : string {
        return path_audio + name;
    }
}
