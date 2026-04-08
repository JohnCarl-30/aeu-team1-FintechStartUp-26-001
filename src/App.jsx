import { Routes, Route } from 'react-router-dom'
import { AlphaexploraLandingView } from './views/AlphaexploraLandingView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AlphaexploraLandingView />} />
    </Routes>
  )
}

export default App
