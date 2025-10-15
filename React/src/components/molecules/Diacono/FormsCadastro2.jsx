import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { InputSenhaDiacono } from "../../atoms/Diacono/InputSenhaDiacono";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { BotaoGoogle } from "../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../atoms/Global/LinkAcesso";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";

export function FormsCadastro2() {
  const navigate = useNavigate();
  const { dadosCadastro, setDadosCadastro } = useCadastro();
  const { validarNome, validarCpf, senhasConferem } = useValidacaoCadastro();

  const handleAvancar = () => {
    const camposObrigatorios = ["nome", "nascimento", "cpf", "email", "senha", "confirmarSenha"];
    const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

    if (camposVazios.length > 0) {
      alert("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    if (!senhasConferem(dadosCadastro.senha, dadosCadastro.confirmarSenha)) {
      alert("As senhas não conferem. Verifique os campos de senha.");
      return;
    }

    navigate("/cadastro3");
  };


  const handleChange = (campo) => (e) => {
    setDadosCadastro({ ...dadosCadastro, [campo]: e.target.value });
  };

  return (

    <div className="w-[55%] flex flex-col gap-5">
      <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
      <EtapasCadastro corLinha="border-diacono-blue-100" corTexto="text-diacono-blue-200" className1="bg-diacono-blue-400 text-white" className2="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" />
      <div className="flex flex-col gap-5">
        <InputDiacono
          value={dadosCadastro.nome}
          onChange={handleChange("nome")}
          onBlur={(e) => {
            const nomeFormatado = validarNome(e.target.value)
            setDadosCadastro({ ...dadosCadastro, nome: nomeFormatado })
          }}
          label="Nome Completo"
          placeholder="Digite seu nome" />
        <div className="flex justify-between">
          <InputDiacono
            value={dadosCadastro.nascimento}
            onChange={handleChange("nascimento")}
            label="Data de Nascimento"
            type="date"
            className="text-diacono-blue-200"
          />
          <InputDiacono
            value={dadosCadastro.cpf}
            onChange={handleChange("cpf")}
            label="CPF"
            placeholder="Digite seu CPF"
            onBlur={(e) => {
              const cpfValido = validarCpf(e.target.value);
              if (!cpfValido) alert("CPF inválido");
            }}

          />
        </div>
        <InputDiacono
          value={dadosCadastro.email}
          onChange={handleChange("email")}
          label="Email"
          placeholder="Digite seu email" />
        <div className="flex justify-between">
          <InputSenhaDiacono
            value={dadosCadastro.senha}
            onChange={handleChange("senha")}
            texto="Senha"
            placeholder="Digite sua senha" />
          <InputSenhaDiacono
            value={dadosCadastro.confirmarSenha}
            onChange={handleChange("confirmarSenha")}
            texto="Confirmar Senha"
            placeholder="Confirme a senha" />
        </div>
        <div className='flex flex-col gap-3 items-end'>
          <div className="w-full flex gap-40">
            <BotaoDiacono onClick={() => navigate('/cadastro1')}>Voltar</BotaoDiacono>
            <BotaoDiacono onClick={handleAvancar}>Próximo</BotaoDiacono>
          </div>
          <BotaoGoogle>Entrar com o Google</BotaoGoogle>
          <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
        </div>
      </div>
    </div >
  );
}