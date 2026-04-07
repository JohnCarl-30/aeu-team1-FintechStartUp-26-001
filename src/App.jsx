import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AlphaexploraLandingView } from './views/AlphaexploraLandingView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AlphaexploraLandingView />} />
    </Routes>
  )
}

export default App
