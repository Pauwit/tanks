
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
