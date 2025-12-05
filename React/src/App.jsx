import './App.css'
import { AuthProvider } from "./routes/AuthContext";
import { AppRoutes } from './routes/routes';

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
