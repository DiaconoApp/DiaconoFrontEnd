import { InputPadrao } from "../atoms/InputPadrao";
import { EtapasCadastro } from "./EtapasCadastro";
import { BotaoPadrao } from "../atoms/BotaoPadrao";
import { BotaoGoogle } from "../atoms/BotaoGoogle";
import { LinkAcesso } from "../atoms/LinkAcesso";
import { useNavigate } from "react-router-dom";

export function FormsCadastro3() {
    const navigate = useNavigate();
    return (
        <div className="w-[55%] flex flex-col gap-5">
            <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
            <EtapasCadastro className1="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className2="bg-diacono-blue-400 text-white"/>
            <div className="flex flex-col gap-5">
                <label className="font-semibold text-diacono-blue-400">Endereço</label>
                <div className="flex justify-between">
                    <InputPadrao label="CEP" placeholder="Digite seu CEP" />
                    <InputPadrao label="Rua/Avenida" placeholder="Ex: Rua Japão" />
                </div>
                <div className="flex justify-between">
                    <InputPadrao label="Bairro" placeholder="Digite sua senha" />
                    <InputPadrao label="Cidade" placeholder="Confirme a senha" />
                </div>
                <div className="flex justify-between">
                    <InputPadrao label="CEP" placeholder="Digite seu CEP" />
                    <InputPadrao label="Rua/Avenida" placeholder="Ex: Rua Japão" />
                </div>
                <div className='flex flex-col gap-3 items-end'>
                    <div className="w-full flex justify-between gap-10">
                        <div className="w-[30%]">
                            <BotaoPadrao onClick={() => navigate('/cadastro2')}>Voltar</BotaoPadrao>
                        </div>
                        <div className="w-[50%]">
                            <BotaoPadrao onClick={() => navigate('/cadastro3')}>Finalizar cadastro</BotaoPadrao>
                        </div>
                    </div>
                    <BotaoGoogle>Entrar com o Google</BotaoGoogle>
                    <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
                </div>
            </div>
        </div>
    );
}