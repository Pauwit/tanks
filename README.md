# Tanks in a Nutshell

A real-time multiplayer tank battle game built with **React**, **TypeScript**, and **Firebase**. This project features a lobby system, real-time synchronization of game state, and support for both keyboard/mouse and gamepad inputs.

## 🚀 Tech Stack

* **Core Framework**: [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Backend / Database**: [Firebase](https://firebase.google.com/) (Realtime Database, Authentication, Cloud Functions)
* **Styling & UI**: CSS Modules, Framer Motion, FontAwesome, Lucide React
* **Game Rendering**: HTML5 Canvas API

## ✨ Features

* **Multiplayer Lobbies**: Create, join, and manage game lobbies.
* **Real-time Gameplay**: Synchronized player positions, rotations, projectiles, and explosions via Firebase Realtime Database.
* **Cross-Input Support**: Full support for Gamepad (Dual Stick) and Keyboard/Mouse.
* **Dynamic Game Loop**: Custom game loop engine handling physics, collisions, and rendering independent of React renders.

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/tanks.git](https://github.com/your-username/tanks.git)
    cd tanks
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory of the project (next to `package.json`). Add your Firebase configuration keys using the `VITE_` prefix so the application can load them:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key_here
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.europe-west1.firebasedatabase.app
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 🎮 Controls

### Gamepad
The game supports dual-stick controls for tank movement and aiming.

* **Left Stick**: Movement
    * *Up/Down*: Axis 1
    * *Left/Right*: Axis 0
* **Right Stick**: Aiming / Turret Rotation
    * *Up/Down*: Axis 5
    * *Left/Right*: Axis 2

### Keyboard & Mouse
*Standard WASD keys for movement and Mouse for aiming are supported.*

## 📂 Project Structure

The project is divided into two main sections: the **UI** (React) and the **Game Engine** (Canvas/TypeScript classes).

```text
src/
├── firebase/       # Firebase configuration, auth, and API calls
├── game/           # Core game logic (independent of React)
│   ├── bomb/       # Bomb logic and managers
│   ├── bullet/     # Bullet physics and stats
│   ├── drawer/     # Canvas rendering logic
│   ├── input/      # Input handlers (Gamepad, Keyboard, Mouse)
│   ├── map/        # Map generation and management
│   ├── tank/       # Player and Enemy tank classes
│   └── main.ts     # Game entry point and loop initialization
├── ui/             # React components (Lobbies, Title Screen, HUD)
└── App.tsx         # Main React application entry point
