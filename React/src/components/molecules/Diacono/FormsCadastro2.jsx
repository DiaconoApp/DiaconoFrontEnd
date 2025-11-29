import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { BotaoGoogle } from "../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../atoms/Global/LinkAcesso";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, isTelefone } from "../../../utils/Utils";
import { useState } from "react";

export function FormsCadastro2() {
  const navigate = useNavigate();
  const { dadosCadastro, setDadosCadastro } = useCadastro();
  const [erros, setErros] = useState({});
  const { validarNome, validarCpf } = useValidacaoCadastro();

  const handleChange = (campo, valor) => {
    let novoValor = valor;

    if (campo === "cpf") {
      const cpfValido = validarCpf(valor);
      setErros((prev) => {
        const atualizados = { ...prev };
        if (!cpfValido) {
          atualizados.cpf = "CPF inválido";
        } else {
          delete atualizados.cpf;
        }
        return atualizados;
      });
    }

    setDadosCadastro((prev) => ({ ...prev, [campo]: novoValor }));
  };

  const handleBlur = (campo) => {
    const valor = dadosCadastro[campo];

    switch (campo) {
      case "nome":
        const nomeCorrigido = validarNome(valor);
        setDadosCadastro((prev) => ({ ...prev, nome: nomeCorrigido }));
        break;

      case "cpf":
        const cpfValido = validarCpf(valor);
        setErros((prev) => ({
          ...prev,
          cpf: cpfValido ? undefined : "CPF inválido",
        }));
        break;

      case "celular":
        const celularValido = isTelefone(valor);
        setErros((prev) => ({
          ...prev,
          celular: celularValido ? undefined : "Celular inválido",
        }));
        break;

      case "generoMembro":
        const generoValido = valor === "MASCULINO" || valor === "FEMININO";
        setErros((prev) => ({
          ...prev,
          generoMembro: generoValido ? undefined : "Gênero inválido",
        }));
        break;

      default:
        break;
    }
  };

  const handleAvancar = () => {
    const camposObrigatorios = ["nome", "dataNascimento", "cpf", "celular", "generoMembro"];
    const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

    if (camposVazios.length > 0 || Object.values(erros).some(e => e)) {
      alert("Preencha todos os campos corretamente para continuar.");
      return;
    }

    navigate("/cadastro/etapa3");
  };

  return (

    <div className="w-[65%] flex flex-col gap-5">
      <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
      <EtapasCadastro corLinha="border-diacono-blue-100" corTexto="text-diacono-blue-200" className1="bg-diacono-blue-400 text-white" className2="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className3="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" />
      <div className="flex flex-col gap-5">
        <InputDiacono
          label="Nome Completo *"
          placeholder="Digite seu nome"
          value={dadosCadastro.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          onBlur={() => handleBlur("nome")}
        />
        <div className="flex justify-between">
          <div>
            <InputDiacono
              label="CPF *"
              placeholder="Digite seu CPF"
              value={formatarCpf(dadosCadastro.cpf) || dadosCadastro.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              onBlur={() => handleBlur("cpf")}
            />
            {erros.cpf && <div className="text-red-500 text-sm mt-1">{erros.cpf}</div>}
          </div>
          <div>
            <InputDiacono
              label="Data de Nascimento *"
              type="date"
              className="text-diacono-blue-200"
              value={dadosCadastro.dataNascimento}
              onChange={(e) => handleChange("dataNascimento", e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-diacono-blue-400">Gênero *</label>
            <select
              value={dadosCadastro.generoMembro}
              onChange={(e) => handleChange("generoMembro", e.target.value)}
              className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-10 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]"
            >
              <option value="" disabled>Selecione seu gênero</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
            </select>
          </div>
          <div>
            <InputDiacono
              label="Celular *"
              placeholder="Digite seu celular"
              value={formatarTelefone(dadosCadastro.celular) || dadosCadastro.celular}
              onChange={(e) => handleChange("celular", e.target.value)}
              onBlur={() => handleBlur("celular")}
            />
            {erros.celular && <div className="text-red-500 text-sm mt-1">{erros.celular}</div>}
          </div>
        </div>
        <div className='flex flex-col gap-3 items-end'>
          <div className="w-full flex gap-40">
            <BotaoDiacono onClick={() => navigate('/cadastro/etapa1')}>Voltar</BotaoDiacono>
            <BotaoDiacono onClick={handleAvancar}>Próximo</BotaoDiacono>
          </div>
          <BotaoGoogle>Entrar com o Google</BotaoGoogle>
          <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
        </div>
      </div>
    </div >
  );
}