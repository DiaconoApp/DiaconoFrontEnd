import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { CadastroLayout } from "../../templates/Diacono/CadastroLayout";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, isTelefone } from "../../../utils/Utils";
import { useState, useEffect } from "react";
import { AlertModal } from "../../ui/AlertModal";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../../services/login";
import { useAuth } from "../../../routes/AuthContext.jsx";

export function FormsCadastro2() {
  const navigate = useNavigate();
  const { dadosCadastro, setDadosCadastro } = useCadastro();
  const [erros, setErros] = useState({});
  const [modal, setModal] = useState(null);
  const { validarNome, validarCpf } = useValidacaoCadastro();
  const { setUser } = useAuth();

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
      setModal({
        type: "warning",
        title: "Campos obrigatórios",
        message: "Preencha todos os campos corretamente para continuar."
      });
      return;
    }

    navigate("/cadastro/etapa3");
  };

  // callback invoked by the Google hook when the user successfully logs in
  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential; // new library returns `credential`
    try {
      const { payload, user } = await loginWithGoogle(idToken);
      setUser(user);
      handleAvancar();
    } catch (e) {
      console.error("erro no login Google", e);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => console.error("Google login falhou", err),
    onNonOAuthError: (nonOAuth) => console.error("Google non-OAuth error", nonOAuth),
  });

  // debug: show global google object if available
  useEffect(() => {
    console.log('window.google at mount', window.google);
  }, []);

  return (
    <CadastroLayout
      etapaAtual={1}
      onVoltar={() => navigate('/cadastro/etapa1')}
      onProximo={handleAvancar}
    >
      <InputDiacono
        label="Nome Completo *"
        placeholder="Digite seu nome"
        value={dadosCadastro.nome}
        onChange={(e) => handleChange("nome", e.target.value)}
        onBlur={() => handleBlur("nome")}
      />
      <div className="grid grid-cols-2 gap-6">
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
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-diacono-blue-400">Gênero *</label>
          <select
            value={dadosCadastro.generoMembro}
            onChange={(e) => handleChange("generoMembro", e.target.value)}
            className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg py-2.5 px-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]"
          >
            <option value="" hidden>Selecione seu gênero</option>
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
        {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
      </div>
    </CadastroLayout>
  );
}