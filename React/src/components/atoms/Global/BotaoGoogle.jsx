import { FcGoogle } from 'react-icons/fc'
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../../../services/login';
import { useAuth } from '../../../routes/AuthContext';

export function BotaoGoogle({ children, redirectTo = '/eventos', onErrorLogin, ...props }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;

    try {
      const { user } = await loginWithGoogle(credentialResponse.credential);
      setUser(user);
      navigate(redirectTo);
    } catch (error) {
      console.error('Erro no login com Google:', error);
      if (onErrorLogin) onErrorLogin(error);
    }
  };

  return (
    <div className="relative w-full">
      <button
        {...props}
        type="button"
        className="bg-[#CEDAEA] text-diacono-blue-400 h-10 flex items-center justify-center w-full gap-2 rounded-lg font-semibold"
      >
        <FcGoogle className="text-2xl" />
        {children}
      </button>

      <div className="absolute inset-0 opacity-0 overflow-hidden rounded-lg">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            const error = new Error('Login com Google falhou');
            console.error(error.message);
            if (onErrorLogin) onErrorLogin(error);
          }}
          width="100%"
        />
      </div>
    </div>
  );
}