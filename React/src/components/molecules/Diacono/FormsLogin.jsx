import { InputDiacono } from '../../atoms/Diacono/InputDiacono'
import { InputSenhaDiacono } from '../../atoms/Diacono/InputSenhaDiacono';
import { BotaoDiacono } from '../../atoms/Diacono/BotaoDiacono';
import { BotaoGoogle } from '../../atoms/Global/BotaoGoogle';
import { LinkAcesso } from '../../atoms/Global/LinkAcesso';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { login, loginWithGoogle } from '../../../services/login';
import { useAuth } from '../../../routes/AuthContext.jsx';
import { GoogleLogin } from '@react-oauth/google';

export function FormsLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { user } = await login(email, senha);
            setUser(user);
            navigate("/eventos");
        } catch (err) {
            console.error("Erro no login:", err);
            setErro("Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse?.credential;
        if (!idToken) {
            console.error('Google response sem credential', credentialResponse);
            setErro('Erro ao fazer login com Google');
            return;
        }

        setLoading(true);
        setErro("");
        try {
            const { user } = await loginWithGoogle(idToken);
            setUser(user);
            navigate("/eventos");
        } catch (err) {
            console.error("erro google login", err);
            setErro(err.message || "Erro ao fazer login com Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-100 h-auto flex flex-col gap-8">
            <span className="font-bold text-[28px] text-diacono-blue-400">Acesse sua conta</span>

            <div className='flex flex-col gap-6'>
                <InputDiacono
                    label={"Email"}
                    placeholder={"exemplo@hotmail.com"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <InputSenhaDiacono
                    texto={"Senha"}
                    placeholder={"Digite sua senha"}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-6'>
                {erro && <span className='text-icf-primary-400'>{erro}</span>}
                <BotaoDiacono type="submit" disabled={loading}>
                    {loading ? <FaSpinner className='animate-spin h-5 w-5 text-white' /> : "Entrar"}
                </BotaoDiacono>
                {googleClientId && (
                    <div className='relative w-full'>
                        <BotaoGoogle disabled={loading}>Entrar com Google</BotaoGoogle>
                        <div className={`absolute inset-0 ${loading ? 'pointer-events-none' : ''} opacity-0`}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={(err) => {
                                    console.error('Google login falhou', err);
                                    setErro('Erro ao fazer login com Google');
                                }}
                                width="100%"
                                className="w-full h-full"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                )}
                <LinkAcesso
                    onClick={() => navigate('/cadastro/etapa1')}
                    label={"Não tem uma conta?"}
                    link={"Cadastre-se"}
                />
            </div>
        </form>
    );
}

