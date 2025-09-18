export enum LobbyStatus {
    Error,
    Waiting = "waiting", // Players are in Lobby, Owner can change config, waiting for players...
    Loading = "loading", // All players have to load in the canvas and the map, and wait for the lobby state to be ready
    Started = "started", // Game is ongoing
}