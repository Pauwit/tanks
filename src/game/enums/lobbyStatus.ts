export enum LobbyStatus {
    Error,
    Waiting = "waiting", // Players are in Lobby, Owner can change config, waiting for players...
    Loading = "loading", // All players have to load in the canvas and the map, and wait for the lobby state to be ready
    Ready = "ready", // If player, send a ready sign when loaded. If owner, wait for all players before starting
    Started = "started", // Game is ongoing
}