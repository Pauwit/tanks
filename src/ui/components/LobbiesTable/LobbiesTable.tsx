import React, {useEffect, useState} from "react";
import "./LobbiesTable.css";
import type {LobbySummaryModel} from "../../../firebase/models/lobbySummaryModel.ts";
import {getLobbies} from "../../../firebase/calls/getLobbies.ts";
import {LogIn, Plus, RefreshCw, Settings} from "lucide-react";
import {showError} from "../ErrorContext/errorStore.ts";
import {LobbyStatus} from "../../../game/enums/lobbyStatus.ts";
import {getLobby} from "../../../firebase/calls/getLobby.ts";
import {Firebase} from "../../../firebase/firebase.ts";
import SettingsPopup from "../SettingsPopup/SettingsPopup.tsx";
import LobbyCreationPopup from "../LobbyCreationPopup/LobbyCreationPopup.tsx";


type LobbiesTableProps = {
    onSelectLobby?: (id: string) => void;
};

const LobbiesTable: React.FC<LobbiesTableProps> = ({ onSelectLobby }) => {
    const [lobbies, setLobbies] = useState<LobbySummaryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [addLobby, setAddLobby] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            setLobbies(await getLobbies());
        } catch (error) {
            console.error('[ERR] lobby - Failed to fetch lobbies :', error);
            showError('Failed to fetch lobbies :', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            await handleRefresh();
        })();
    }, []);

    const handleJoin = async (id: string) => {
        function joinLobby(id: string) {
            console.log("[LOG] lobby - Joining lobby:", id);
            onSelectLobby?.(id);
        }

        const lobby = await getLobby(id);
        if (lobby === null) {
            console.error("[ERR] lobby - Lobby does not exist anymore");
            showError("Lobby does not exist anymore");
            return;
        }

        // If player already in playerList, can join
        for (const player of lobby.players) {
            if (player.uid === Firebase.uid) {
                joinLobby(id);
                return;
            }
        }

        if (lobby.status !== LobbyStatus.Waiting || lobby.players.length >= lobby.config.maxPlayers) {
            console.error("[ERR] lobby - Unable to join this lobby");
            showError("Unable to join this lobby");
            return;
        }

        joinLobby(id);
    };

    function isLobbyJoinable(lobby: LobbySummaryModel): boolean {
        // If player already in playerList, can join
        for (const player of lobby.players) {
            if (player.uid === Firebase.uid) {
                return true;
            }
        }

        return lobby.status === 'waiting' && lobby.players.length < lobby.maxPlayers;
    }

    function handleAddLobby() {
        setAddLobby(true);
    }

    return (
        <>
            {showSettings && (
                <div className="popup-backdrop"
                     onClick={() => setShowSettings(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <SettingsPopup
                            onClose={() => setShowSettings(false)}
                        />
                    </div>
                </div>
            )}
            {addLobby && (
                <div className="popup-backdrop"
                     onClick={() => setAddLobby(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <LobbyCreationPopup
                            onClose={() => setAddLobby(false)}
                            onCreation={(id: string) => {
                                setAddLobby(false);
                                onSelectLobby?.(id);
                            }}
                        />
                    </div>
                </div>
            )}
            <div className="lobby-table-container">
                <div className="lobby-header">
                    <div className="spacer" />
                    <h1 className="lobby-table-title">
                        {"Welcome, " + Firebase.name}
                    </h1>
                    <button className="settings-button" onClick={() => setShowSettings(true)} title="Settings">
                        <Settings size={20} />
                    </button>
                </div>
                <table className="lobby-table">
                    <thead>
                    <tr>
                        <th className="name-col">Name</th>
                        <th className="players-col">Players</th>
                        <th className="status-col">
                            <div className="header-with-icon">
                                <span>Status</span>
                                <div className="button-container">
                                    <button
                                        onClick={handleRefresh}
                                        className="refresh-button"
                                        title="Refresh"
                                        disabled={loading}
                                    >
                                        <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                                    </button>
                                    <button
                                        onClick={handleAddLobby}
                                        className="add-button"
                                        title="Add"
                                        disabled={loading}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {lobbies.map((lobby) => {
                        const isJoinable = isLobbyJoinable(lobby);
                        return (
                            <tr
                                key={lobby.id}
                                className={`lobby-row ${(isJoinable && !loading) ? 'clickable' : 'disabled'}`}
                                onClick={() => isJoinable && handleJoin(lobby.id)}
                            >
                                <td className="lobby-name">{lobby.name}</td>
                                <td className="lobby-players">
                                    {lobby.players.length} / {lobby.maxPlayers}
                                </td>
                                <td className="lobby-status">
                                    <span>{lobby.status}</span>
                                    {isJoinable && (
                                        <span className="join-icon">
                                            <LogIn size={18} strokeWidth={2} />
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default LobbiesTable;
