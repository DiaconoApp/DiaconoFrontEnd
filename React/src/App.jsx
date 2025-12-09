import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppRoutes } from './routes/routes';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  )
}

export default App
