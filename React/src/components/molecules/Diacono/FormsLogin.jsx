import { InputDiacono } from '../../atoms/Diacono/InputDiacono'
import { InputSenhaDiacono } from '../../atoms/Diacono/InputSenhaDiacono';
import { BotaoDiacono } from '../../atoms/Diacono/BotaoDiacono';
import { BotaoGoogle } from '../../atoms/Global/BotaoGoogle';
import { LinkAcesso } from '../../atoms/Global/LinkAcesso';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { login } from '../../../services/authService';

export function FormsLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, senha); 
            navigate("/menu");
        } catch {
            setErro("Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="w-100 h-auto flex flex-col gap-8">
                <span className="font-bold text-[28px] text-diacono-blue-400">Acesse sua conta</span>
                <div className='flex flex-col gap-6'>
                    <InputDiacono label={"Email"} placeholder={"exemplo@hotmail.com"} value={email} onChange={e => setEmail(e.target.value)} />
                    <InputSenhaDiacono texto={"Senha"} placeholder={"Digite sua senha"} value={senha} onChange={e => setSenha(e.target.value)}>
                        <div className='flex justify-end'>
                            <span className="cursor-pointer flex text-diacono-blue-200">Esqueci minha senha</span>
                        </div>
                    </InputSenhaDiacono>
                </div>
                <div className='flex flex-col gap-6'>
                    {erro && <span className='text-icf-primary-400'>{erro}</span>}
                    <BotaoDiacono disabled={loading}>{loading ? <FaSpinner className='animate-spin h-5 w-5 text-white' /> : "Entrar"}</BotaoDiacono>
                    <BotaoGoogle>Entrar com Google</BotaoGoogle>
                    <LinkAcesso onClick={() => navigate('/cadastro1')} label={"Não tem uma conta?"} link={"Cadastre-se"} />
                </div>
            </div>
        </form>
    )
}