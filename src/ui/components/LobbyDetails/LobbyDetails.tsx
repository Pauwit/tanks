import React, {useEffect, useState} from 'react';
import './LobbyDetails.css';
import {FaCrown} from 'react-icons/fa';
import type {LobbyDataModel} from "../../../game/firebase/models/lobbyDataModel.ts";
import {LobbyStatus} from "../../../game/enums/lobbyStatus.ts";
import {ref, onValue} from "firebase/database";
import {Firebase} from "../../../game/firebase/firebase.ts";

type LobbyDetailsProps = {
    id : string;
    onBack?: () => void;
};

const defaultLobby: LobbyDataModel = {
    name: "",
    status: LobbyStatus.Waiting,
    players: [],
    config: {
        owner: "",
        maxPlayers: 0,
        gamemode: "",
    },
}

const LobbyDetails: React.FC<LobbyDetailsProps> = ({id, onBack}: LobbyDetailsProps) => {
    const [lobby, setLobby] = useState<LobbyDataModel>(defaultLobby);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const lobbyRef = ref(Firebase.db, `lobbies/${id}`);

        const unsubscribe = onValue(lobbyRef, (snapshot) => {
            if (snapshot.exists()) {
                setLobby(snapshot.val() as LobbyDataModel);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [id]);

    function handleStartGame() {
        console.log("[LOG] LobbyDetails - Clicked on Start Game");
        // TODO
    }

    function handleBack() {
        console.log("[LOG] lobby - Leaving lobby :", id);
        // TODO
        onBack?.();
    }

    return (
        <div className="lobby-details-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}
            <h2 className="lobby-title">{lobby.name}</h2>
            <p className="lobby-id">ID: {id}</p>

            <div className="lobby-info-section">
                <div className="gamemode-box">
                    <span className="gamemode-label">Status</span>
                    <span className="gamemode-value">{lobby.status}</span>
                </div>
                <div className="gamemode-box">
                    <span className="gamemode-label">Gamemode</span>
                    <span className="gamemode-value">{lobby.config.gamemode}</span>
                </div>
                <div className="gamemode-box">
                    <span className="gamemode-label">Map</span>
                    <span className="gamemode-value">Unknown</span>
                </div>
                <div className="gamemode-box">
                    <span className="gamemode-label">???</span>
                    <span className="gamemode-value">???</span>
                </div>

                {/* Add future map-box or others beside */}
            </div>

            <div className="player-table">
                <div className="player-table-header">
                    <span>Players</span>
                    <span>{lobby.players.length} / {lobby.config.maxPlayers}</span>
                </div>
                <div className="player-table-body">
                    {lobby.players.map((player) => (
                        <div key={player.uid} className="player-row">
              <span>
                {player.uid === lobby.config.owner && <FaCrown className="owner-icon" />}
                  {player.name}
              </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="button-container">
                {onBack && (
                    <button className="back-button" onClick={handleBack}>
                        ← Back to lobbies
                    </button>
                )}
                {Firebase.uid === lobby.config.owner && (
                    <button className="start-game-button" onClick={handleStartGame}>
                        ▶ Start game
                    </button>
                )}
            </div>
        </div>
    );
};

export default LobbyDetails;
