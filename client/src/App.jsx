import { Route, Routes } from 'react-router-dom'
import LobbyScreen from '/src/screens/lobby.jsx'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
      </Routes>
    </div>
  )
}

export default App
