export enum LobbyWaitingState {
  None = "Finished Loading!",
  Error = "An error occurred. Please reload the page.",
  InitializingCanvas = "Initializing canvas...",
  GettingLobbyInfo = "Getting lobby info...",
  WaitingForPlayers = "Waiting for other players...",
  WaitingForOwner = "Waiting for lobby owner...",
}