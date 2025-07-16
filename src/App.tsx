import './App.css';
import './firebase/firebase.ts';
import LobbiesTable from "./ui/components/LobbiesTable/LobbiesTable.tsx";
import {ErrorToastProvider} from "./ui/components/ErrorContext/ErrorContext.tsx";
import LobbyDetails from "./ui/components/LobbyDetails/LobbyDetails.tsx";
import {useState} from "react";
import TitleScreen from "./ui/components/TitleScreen/TitleScreen.tsx";

function App() {
    const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);
    const [started, setStarted] = useState(false);

    return (
        <ErrorToastProvider>
            {!started && <TitleScreen onStart={() => setStarted(true)} />}
            {started && (
                <>
                {selectedLobbyId ? (
                        <LobbyDetails id={selectedLobbyId} onBack={() => setSelectedLobbyId(null)} />
                    ) : (
                        <LobbiesTable onSelectLobby={setSelectedLobbyId} />
                )}
                </>
            )}
        </ErrorToastProvider>
    );
}

export default App;
