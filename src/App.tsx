import './App.css';
import './firebase/firebase.ts';
import LobbiesTable from "./ui/components/LobbiesTable/LobbiesTable.tsx";
import {ErrorToastProvider} from "./ui/components/ErrorContext/ErrorContext.tsx";
import LobbyDetails from "./ui/components/LobbyDetails/LobbyDetails.tsx";
import {useState} from "react";
import TitleScreen from "./ui/components/TitleScreen/TitleScreen.tsx";
import {GameCanvas} from "./ui/components/GameCanvas/GameCanvas.tsx";
import type {LobbyDataModel} from "./firebase/models/lobbyDataModel.ts";

function App() {
    const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);
    const [started, setStarted] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <ErrorToastProvider>
            {!loggedIn && <TitleScreen onStart={() => setLoggedIn(true)} />}
            {loggedIn && (
                <>
                {(selectedLobbyId !== null && started) ? (
                  <>
                      <GameCanvas id={selectedLobbyId} />
                  </>
                ) : (
                  <>
                      {selectedLobbyId ? (
                          <LobbyDetails id={selectedLobbyId} onBack={() => setSelectedLobbyId(null)} onStart={() => setStarted(true)} />
                      ) : (
                          <LobbiesTable onSelectLobby={setSelectedLobbyId} />
                      )}
                  </>
                )}

                </>
            )}
        </ErrorToastProvider>
    );
}

export default App;
