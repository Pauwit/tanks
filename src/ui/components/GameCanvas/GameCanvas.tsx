import {useEffect} from "react";

export function GameCanvas() {
    useEffect(() => {
        import('../../../game/main.ts'); // Will run after canvas exists
    }, []);

    return (
        <>
            <div id="all">
                <div id="fpsDisplay"></div>
                <div id="deltaDisplay"></div>
                <canvas id="canvas"></canvas>
            </div>
        </>
    );
}