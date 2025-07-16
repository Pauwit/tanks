import React, {useState} from 'react';
import './TitleScreen.css';
import {authenticate} from "../../../game/firebase/auth.ts";
import {Firebase} from "../../../game/firebase/firebase.ts";

type TitleScreenProps = {
    onStart: () => void;
};

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
    const [signIn, setSignIn] = useState<boolean>(false);

    async function handleOnClick() {
        setSignIn(true);
        await Firebase.connectToFirebase();
        onStart?.();
    }

    return (
        <div className="title-screen" onClick={handleOnClick}>
            <h1 className="game-title">Tanks in a Nutshell</h1>
            {signIn ? (
                <>
                    <img
                        src="/icons/load.png"
                        alt="Loading..."
                        className="spinning"
                        width={52}
                        height={78}
                    />
                    <p className="bottom-text">Signing in...</p>
                </>
            ) : (
                <p className="click-to-start">Click to start</p>
            )}
        </div>
    );
};

export default TitleScreen;
