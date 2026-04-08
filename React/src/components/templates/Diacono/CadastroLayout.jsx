import { EtapasCadastro } from "../../molecules/Global/EtapasCadastro";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { BotaoGoogle } from "../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../atoms/Global/LinkAcesso";
import { useNavigate } from "react-router-dom";

export function CadastroLayout({ 
  etapaAtual, 
  children, 
  onVoltar, 
  onProximo, 
  textoBotaoProximo = "Próximo" 
}) {
  const navigate = useNavigate();

  const getEtapasClasses = () => {
    const base = "bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200";
    const ativo = "bg-diacono-blue-400 text-white";
    
    return {
      className1: etapaAtual === 1 ? ativo : base,
      className2: etapaAtual === 2 ? ativo : base,
      className3: etapaAtual === 3 ? ativo : base,
    };
  };

  const etapasClasses = getEtapasClasses();

  return (
    <div className="w-[65%] flex flex-col gap-5">
      {/* Header - Estático */}
      <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
      <EtapasCadastro 
        corLinha="border-diacono-blue-100" 
        corTexto="text-diacono-blue-200" 
        className1={etapasClasses.className1}
        className2={etapasClasses.className2}
        className3={etapasClasses.className3}
      />
      
      {/* Conteúdo dos inputs - Dinâmico */}
      <div className="flex flex-col gap-6 min-h-[320px]">
        {children}
      </div>
      
      {/* Footer - Estático */}
      <div className="flex flex-col gap-3 items-end">
        <div className="grid grid-cols-2 gap-6 w-full">
          <BotaoDiacono onClick={onVoltar}>Voltar</BotaoDiacono>
          <BotaoDiacono onClick={onProximo}>{textoBotaoProximo}</BotaoDiacono>
        </div>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && <BotaoGoogle>Entrar com o Google</BotaoGoogle>}
        <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
      </div>
    </div>
  );
}
