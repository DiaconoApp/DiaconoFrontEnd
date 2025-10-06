import { InputDiacono } from "../atoms/InputDiacono";
import { InputSenha } from "../atoms/InputSenha";
import { EtapasCadastro } from "./EtapasCadastro";
import { BotaoDiacono } from "../atoms/BotaoDiacono";
import { BotaoGoogle } from "../atoms/BotaoGoogle";
import { LinkAcesso } from "../atoms/LinkAcesso";
import { useNavigate } from "react-router-dom";

export function FormsCadastro2() {
  const navigate = useNavigate();
  return (
    <div className="w-[55%] flex flex-col gap-5">
      <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
      <EtapasCadastro className1="bg-diacono-blue-400 text-white" className2="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" />
      <div className="flex flex-col gap-5">
        <InputDiacono label="Nome Completo" placeholder="Digite seu nome" />
        <div className="flex justify-between">
          <InputDiacono label="Data de Nascimento" type="date" className="text-diacono-blue-200" />
          <InputDiacono label="CPF" placeholder="Digite seu CPF" />
        </div>
        <InputDiacono label="Email" placeholder="Digite seu email" />
        <div className="flex justify-between">
          <InputSenha texto="Senha" placeholder="Digite sua senha" />
          <InputSenha texto="Confirmar Senha" placeholder="Confirme a senha" />
        </div>
        <div className='flex flex-col gap-3 items-end'>
          <div className="w-full flex gap-40">
            <BotaoDiacono onClick={() => navigate('/cadastro1')}>Voltar</BotaoDiacono>
            <BotaoDiacono onClick={() => navigate('/cadastro3')}>Próximo</BotaoDiacono>
          </div>
          <BotaoGoogle>Entrar com o Google</BotaoGoogle>
          <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
        </div>
      </div>
    </div>
  );
}