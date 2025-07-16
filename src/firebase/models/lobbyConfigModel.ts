export type LobbyConfigModel = {
    owner: string;
    gamemode: string;
    maxPlayers: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map?: any; // Define this further if you know the structure
};