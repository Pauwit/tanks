import React, {useEffect, useState} from "react";
import "./LobbiesTable.css";
import type {LobbySummaryModel} from "../../../game/firebase/models/lobbySummaryModel.ts";
import {getLobbies} from "../../../game/firebase/calls/getLobbies.ts";
import {LogIn, RefreshCw} from "lucide-react";
import {showError} from "../ErrorContext/errorStore.ts";
import {LobbyStatus} from "../../../game/enums/lobbyStatus.ts";
import {getLobby} from "../../../game/firebase/calls/getLobby.ts";
import {Firebase} from "../../../game/firebase/firebase.ts";


type LobbiesTableProps = {
    onSelectLobby?: (id: string) => void;
};

const LobbiesTable: React.FC<LobbiesTableProps> = ({ onSelectLobby }) => {
    const [lobbies, setLobbies] = useState<LobbySummaryModel[]>([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <>
            <h1 className="lobby-table-title">Welcome, {Firebase.name}</h1>
            <div className="lobby-table-container">
                <table className="lobby-table">
                    <thead>
                    <tr>
                        <th className="name-col">Name</th>
                        <th className="players-col">Players</th>
                        <th className="status-col">
                            <div className="header-with-icon">
                                <span>Status</span>
                                <button
                                    onClick={handleRefresh}
                                    className="refresh-button"
                                    title="Refresh"
                                    disabled={loading}
                                >
                                    <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                                </button>
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
