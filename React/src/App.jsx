import './App.css'
import { AuthProvider } from "./routes/AuthContext";
import { AppRoutes } from './routes/routes';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Se não houver clientId configurado, renderiza sem o provider para evitar falha em hooks do Google
  const appContent = (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );

  return googleClientId
    ? <GoogleOAuthProvider clientId={googleClientId}>{appContent}</GoogleOAuthProvider>
    : appContent;
}

export default App
