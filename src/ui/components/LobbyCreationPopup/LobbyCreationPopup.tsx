import React, { useState } from "react";
import "./LobbyCreationPopup.css";
import {X} from "lucide-react";
import {isAlphaNumericalWithSpaces} from "../../../game/misc/misc.ts";
import {createLobby} from "../../../firebase/calls/createLobby.ts";
import {Firebase} from "../../../firebase/firebase.ts";

type LobbyCreationPopupProps = {
    onClose: () => void;
    onCreation: (id: string) => void;
};

const LobbyCreationPopup: React.FC<LobbyCreationPopupProps> = ({ onClose, onCreation }: LobbyCreationPopupProps) => {
    const [name, setName] = useState("Lobby by " + Firebase.name);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string | null>(null);

    async function handleLobbySubmit(e: React.FormEvent) {
        e.preventDefault();

        const nl = name.trim();

        // Test validity
        if (nl === "") {
            setErrorText("Name cannot be empty");
            return;
        }

        if (nl.length < Firebase.MIN_LOBBY_NAME_SIZE) {
            setErrorText(`Name must be at least ${Firebase.MIN_LOBBY_NAME_SIZE} characters long`);
            return;
        }

        if (nl.length > Firebase.MAX_LOBBY_NAME_SIZE) {
            setErrorText(`Name must be at most ${Firebase.MAX_LOBBY_NAME_SIZE} characters long`);
            return;
        }

        if (!isAlphaNumericalWithSpaces(nl)) {
            setErrorText("Name must be alphanumerical (can have spaces)");
            return;
        }

        // It is valid
        setLoading(true);
        const id = await createLobby(nl);
        if (id !== null) {
            onCreation?.(id);
        } else {
            setErrorText("An error occurred");
        }
        setLoading(false);
    }

    return (
        <div className="settings-popup">
            <div className="settings-header">
                <h2>Lobby Creation</h2>
                <button className="close-button" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <form className="settings-form" onSubmit={handleLobbySubmit}>
                <div className="username-input-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="username-input"
                        disabled={loading}
                    />
                </div>
                {errorText !== null && (
                    <div className="error-text">
                        <span>{errorText}</span>
                    </div>
                )}
                <button type="submit" className="apply-button" title="Apply" disabled={loading}>
                    Create Lobby
                </button>
            </form>
        </div>
    );
};

export default LobbyCreationPopup;
