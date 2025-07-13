import './App.css';
import './firebase.ts';
import {useEffect} from "react";

function App() {
    useEffect(() => {
        import('./game/main.ts'); // Will run after canvas exists
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

export default App;
