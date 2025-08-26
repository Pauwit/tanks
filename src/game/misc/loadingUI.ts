import {Window} from "../drawer/window.ts";

const fontSize: number = 60;

function drawLoadingText(text: string) {
    Window.Instance.clear();

    const ctx = Window.Instance.ctx;
    ctx.save();

    ctx.fillStyle = "#ffffff";
    ctx.font = `${fontSize}px sans-serif`;

    const textWidth = ctx.measureText(text).width;

    ctx.fillText(text, Window.Instance.windowWidth / 2 - textWidth / 2, Window.Instance.windowHeight / 2 - fontSize / 2);

    ctx.restore();
}

export function drawWaitingForOtherPlayers() {
    drawLoadingText("Waiting for other players...");
}