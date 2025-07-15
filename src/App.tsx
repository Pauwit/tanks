import './App.css';
import './game/firebase/firebase.ts';
import LobbiesTable from "./ui/components/LobbiesTable/LobbiesTable.tsx";
import {ErrorToastProvider} from "./ui/components/ErrorContext/ErrorContext.tsx";
import LobbyDetails from "./ui/components/LobbyDetails/LobbyDetails.tsx";
import {useState} from "react";

function App() {
    const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);

    return (
        <ErrorToastProvider>
            {selectedLobbyId ? (
                <LobbyDetails id={selectedLobbyId} onBack={() => setSelectedLobbyId(null)} />
            ) : (
                <LobbiesTable onSelectLobby={setSelectedLobbyId} />
            )}
        </ErrorToastProvider>
    );
}

export default App;
