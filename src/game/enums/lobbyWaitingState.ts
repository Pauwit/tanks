export enum LobbyWaitingState {
  None = "Starting game...",
  Error = "An error occurred. Please reload the page.",
  InitializingCanvas = "Initializing canvas...",
  InitializingGame = "Initializing game...",
  GettingLobbyInfo = "Getting lobby info...",
  WaitingForPlayers = "Waiting for other players...",
  WaitingForOwner = "Waiting for lobby owner...",
}