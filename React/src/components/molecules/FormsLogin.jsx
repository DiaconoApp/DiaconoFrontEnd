import { InputDiacono } from '../atoms/InputDiacono'
import { InputSenha } from '../atoms/InputSenha';
import { BotaoDiacono } from '../atoms/BotaoDiacono';
import { BotaoGoogle } from '../atoms/BotaoGoogle';
import { LinkAcesso } from '../atoms/LinkAcesso';
import { useNavigate } from "react-router-dom";

export function FormsLogin() {
    const navigate = useNavigate();
    return (
        <div className="w-100 h-auto flex flex-col gap-8">
            <span className="font-bold text-[28px] text-diacono-blue-400">Acesse sua conta</span>
            <div className='flex flex-col gap-6'>
                <InputDiacono label={"Email"} placeholder={"exemplo@hotmail.com"} />
                <InputSenha texto={"Senha"} placeholder={"Digite sua senha"}>
                    <div className='flex justify-end'>
                        <span className="cursor-pointer flex text-diacono-blue-200">Esqueci minha senha</span>
                    </div>
                </InputSenha>
            </div>
            <div className='flex flex-col gap-6 items-end'>
                <BotaoDiacono>Entrar</BotaoDiacono>
                <BotaoGoogle>Entrar com Google</BotaoGoogle>
                <LinkAcesso onClick={() => navigate('/cadastro1')} label={"Não tem uma conta?"} link={"Cadastre-se"} />
            </div>
        </div>
    )
}