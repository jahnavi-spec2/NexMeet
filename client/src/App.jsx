import { Route, Routes } from 'react-router-dom'
import LobbyScreen from '/src/screens/lobby.jsx'
import RoomScreen from '/src/screens/room.jsx'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LobbyScreen />}/>
        <Route path="/room/:roomId" element={<RoomScreen />}/>
      </Routes>
    </div>
  )
}

export default App
