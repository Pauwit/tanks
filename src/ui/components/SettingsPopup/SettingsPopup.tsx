import React, { useState } from "react";
import "./SettingsPopup.css";
import {X, Upload, RefreshCw} from "lucide-react";
import {Firebase} from "../../../game/firebase/firebase.ts";
import {showError} from "../ErrorContext/errorStore.ts";
import {isAlphaNumerical, sleep} from "../../../game/misc/misc.ts";
import {setName} from "../../../game/firebase/calls/setName.ts";

type SettingsPopupProps = {
    onClose: () => void;
};

const SettingsPopup: React.FC<SettingsPopupProps> = ({ onClose }: SettingsPopupProps) => {
    const [username, setUsername] = useState(Firebase.name);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleNameSubmit(e: React.FormEvent) {
        e.preventDefault();

        const name = username.trim();
        if (Firebase.name === name) {
            return;
        }

        // Test validity
        if (name === "") {
            showError("Name cannot be empty");
            return;
        }

        if (name.length < 4) {
            showError("Name must be at least 4 characters long");
            return;
        }

        if (!isAlphaNumerical(name)) {
            showError("Name must be alphanumerical");
            return;
        }

        // It is valid
        setLoading(true);
        if (await setName(name)) {
            Firebase.name = name;
            setUsername(name);
        } else {
            showError("An error occurred");
        }
        setLoading(false);
    }

    return (
        <div className="settings-popup">
            <div className="settings-header">
                <h2>Settings</h2>
                <button className="close-button" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <form className="settings-form" onSubmit={handleNameSubmit}>
                <label className="form-label">Username</label>
                <div className="username-input-group">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="username-input"
                        disabled={loading}
                    />
                    <button type="submit" className="apply-button" title="Apply" disabled={loading}>
                        {loading ? (
                            <RefreshCw className="spinning" size={16} />
                        ) : (
                            <Upload size={16} />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPopup;
