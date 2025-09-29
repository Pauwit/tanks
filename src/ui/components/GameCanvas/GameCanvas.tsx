import './GameCanvas.css'
import {useEffect} from "react";

type GameCanvasProps = {
    id : string;
};

export function GameCanvas({id} : GameCanvasProps) {
    useEffect(() => {
        import('../../../game/main.ts').then((module) => {
            module.main(id);
        }); // Will run after canvas exists
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