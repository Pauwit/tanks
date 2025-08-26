import React, {useEffect, useRef, useState} from 'react';
import './LobbyDetails.css';
import {FaCrown} from 'react-icons/fa';
import type {LobbyDataModel} from "../../../firebase/models/lobbyDataModel.ts";
import {LobbyStatus} from "../../../game/enums/lobbyStatus.ts";
import {onValue, ref} from "firebase/database";
import {Firebase} from "../../../firebase/firebase.ts";
import {deleteLobby} from "../../../firebase/calls/deleteLobby.ts";
import {leaveLobby} from "../../../firebase/calls/leaveLobby.ts";
import {setLobbyOwner} from "../../../firebase/calls/setLobbyOwner.ts";
import {setStatus} from "../../../firebase/calls/setStatus.ts";
import {Logger} from "../../../game/misc/Logger.ts";

type LobbyDetailsProps = {
    id : string;
    onBack?: () => void;
    onStart?: () => void;
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

const LobbyDetails: React.FC<LobbyDetailsProps> = ({id, onBack, onStart}: LobbyDetailsProps) => {
    const [lobby, setLobby] = useState<LobbyDataModel>(defaultLobby);
    const [loading, setLoading] = useState<boolean>(true);
    const unsubscribeRef = useRef<() => void>(() => {});

    useEffect(() => {
        const lobbyRef = ref(Firebase.db, `lobbies/${id}`);

        const unsubscribe = onValue(lobbyRef, (snapshot) => {
            if (snapshot.exists()) {
                const tmp = snapshot.val() as LobbyDataModel;
                setLobby(tmp);
                setLoading(false);
                // TODO : when status changes, load canvas
            } else {
                Logger.error("lobby", "Lobby got deleted with id :", id);
                onBack?.();
            }
        });

        unsubscribeRef.current = unsubscribe;

        return () => unsubscribe();
    }, [id]);

    async function handleStartGame() {
        Logger.log("LobbyDetails", "Clicked on Start Game");
        await setStatus(id, LobbyStatus.Loading);
        // TODO : show canvas
        onStart?.();
    }

    async function handleBack() {
        Logger.log("lobby", "Leaving lobby :", id);
        unsubscribeRef.current?.();

        if (lobby.players.length <= 1) {
            await deleteLobby(id);
        } else {
            if (lobby.config.owner === Firebase.uid) {
                const newOwner: string = lobby.players[0].uid === lobby.config.owner ? lobby.players[1].uid : lobby.players[0].uid;
                await setLobbyOwner(id, lobby, newOwner);
            }
            await leaveLobby(lobby, id);
        }
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
