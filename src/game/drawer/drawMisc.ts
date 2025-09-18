import {Window} from "./window.ts";

export function drawText(text: string, x: number, y: number, fontSize: number = 60, color: string = "#ffffff") {
    const ctx = Window.Instance.ctx;
    ctx.save();

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px sans-serif`;

    const textWidth = ctx.measureText(text).width;
    const textHeight = ctx.measureText(text).emHeightAscent;

    ctx.fillText(text, x - textWidth / 2, y - fontSize / 2 + textHeight);

    ctx.restore();
}

export function drawCenterLines(color: string = "#ffffff") {
    const ctx = Window.Instance.ctx;
    ctx.save();

    ctx.fillStyle = color;
    ctx.fillRect(0, Window.Instance.windowHeight / 2 - 1, Window.Instance.windowWidth, 3);
    ctx.fillRect(Window.Instance.windowWidth / 2 - 1, 0, 3, Window.Instance.windowHeight);

    ctx.restore();
}