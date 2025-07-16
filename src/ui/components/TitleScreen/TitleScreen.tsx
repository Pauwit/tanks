import React, {useState} from 'react';
import './TitleScreen.css';
import {Firebase} from "../../../firebase/firebase.ts";
import {getName} from "../../../firebase/calls/getName.ts";
import {isAlphaNumerical} from "../../../game/misc/misc.ts";
import {setName} from "../../../firebase/calls/setName.ts";

type TitleScreenProps = {
    onStart: () => void;
};

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
    const [signIn, setSignIn] = useState<boolean>(false);
    const [selectName, setSelectName] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    async function handleOnClick() {
        if (signIn || selectName !== null) return;

        setSignIn(true);
        await Firebase.connectToFirebase();
        const name = await getName(Firebase.uid);
        if (name === null) {
            setSelectName("");
            setSignIn(false);
        } else {
            Firebase.name = name;
            onStart?.();
        }
    }

    async function handleNameSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Test validity
        if (selectName === null) {
            return;
        }

        const name = selectName.trim();

        if (name === "") {
            setErrorText("Name cannot be empty");
            return;
        }

        if (name.length < 4) {
            setErrorText("Name must be at least 4 characters long");
            return;
        }

        if (!isAlphaNumerical(name)) {
            setErrorText("Name must be alphanumerical");
            return;
        }

        // It is valid
        setSignIn(true);
        if (await setName(name)) {
            Firebase.name = name;
            onStart?.();
        } else {
            setSignIn(false);
            setErrorText("An error occurred");
        }
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
                <>
                {selectName !== null ? (
                    <div className="name-selection" onClick={(e) => e.stopPropagation()}>
                        <p className="name-label">Choose a username</p>
                        <div className="name-input-wrapper">
                            <form onSubmit={handleNameSubmit}>
                                <input
                                    type="text"
                                    className="name-input"
                                    value={selectName}
                                    onChange={(e) => setSelectName(e.target.value)}
                                    placeholder="Enter username"
                                />
                                <button className="submit-button" type="submit" disabled={selectName === ""}>
                                    Submit
                                </button>
                            </form>
                        </div>
                        {errorText !== null && (
                            <div className="error-text">
                                <span>{errorText}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="click-to-start">Click to start</p>
                )}
                </>
            )}
        </div>
    );
};

export default TitleScreen;
