
export interface IDrawable {
    /**
     * Draws the object
     * @param ctx The canvas context
     */
    draw(ctx: CanvasRenderingContext2D): void;
}