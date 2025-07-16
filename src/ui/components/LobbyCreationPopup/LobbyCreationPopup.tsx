import React, { useState } from "react";
import "./LobbyCreationPopup.css";
import {X} from "lucide-react";
import {isAlphaNumericalWithSpaces} from "../../../game/misc/misc.ts";
import {createLobby} from "../../../game/firebase/calls/createLobby.ts";

type LobbyCreationPopupProps = {
    onClose: () => void;
    onCreation: (id: string) => void;
};

const LobbyCreationPopup: React.FC<LobbyCreationPopupProps> = ({ onClose, onCreation }: LobbyCreationPopupProps) => {
    const [name, setName] = useState("");
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

        if (nl.length < 4) {
            setErrorText("Name must be at least 4 characters long");
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
