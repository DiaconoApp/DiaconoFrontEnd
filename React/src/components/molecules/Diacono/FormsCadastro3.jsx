import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { InputSenhaDiacono } from "../../atoms/Diacono/InputSenhaDiacono";
import { ValidacaoSenha } from "../../atoms/Diacono/ValidacaoSenha";
import { CadastroLayout } from "../../templates/Diacono/CadastroLayout";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import api from "../../../provider/api";
import { validaEmail } from "../../../utils/Utils";
import { useState } from "react";
import { AlertModal } from "../../ui/AlertModal";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../../services/login";
import { useAuth } from "../../../routes/AuthContext.jsx";

export function FormsCadastro3() {
    const navigate = useNavigate();
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const [erros, setErros] = useState({});
    const [modal, setModal] = useState(null);

    const handleChange = (campo, valor) => {
        let novoValor = valor;

        setDadosCadastro((prev) => ({ ...prev, [campo]: novoValor }));
    };

    const handleBlur = (campo) => {
        const valor = dadosCadastro[campo];

        switch (campo) {
            case "email":
                const emailValido = validaEmail(valor);
                setErros((prev) => ({
                    ...prev,
                    email: emailValido ? undefined : "Email inválido",
                }));
                break;

            case "confirmarSenha":
                const senhasConferem = valor === dadosCadastro.senha;
                setErros((prev) => ({
                    ...prev,
                    confirmarSenha: senhasConferem ? undefined : "Senhas não coincidem",
                }));
                break;

            default:
                break;
        }
    };

    const validarSenhaForte = (senha) => {
        return senha.length >= 8 &&
            /\d/.test(senha) &&
            /[a-z]/.test(senha) &&
            /[A-Z]/.test(senha) &&
            /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(senha);
    };

    const { setUser } = useAuth();

    const handleAvancar = () => {
        const camposObrigatorios = ["email", "senha", "confirmarSenha"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

        if (camposVazios.length > 0 || Object.values(erros).some(e => e)) {
            setModal({
                type: "warning",
                title: "Campos obrigatórios",
                message: "Preencha todos os campos corretamente para continuar."
            });
            return;
        }

        api.post("/register", dadosCadastro)
            .then(() => {
                setModal({
                    type: "success",
                    title: "Sucesso!",
                    message: "Cadastro concluído com sucesso!",
                    autoClose: 2000
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            })
            .catch(() => {
                setModal({
                    type: "error",
                    title: "Erro",
                    message: "Erro ao finalizar cadastro."
                });
            });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        try {
            const { user } = await loginWithGoogle(idToken);
            setUser(user);
            navigate("/cadastro/etapa4");
        } catch (e) {
            console.error("erro google cadastro3", e);
        }
    };

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const loginGoogle = googleClientId
        ? useGoogleLogin({
            onSuccess: handleGoogleSuccess,
            onError: (err) => console.error("Google login falhou", err),
            onNonOAuthError: (nonOAuth) => console.error("Google non-OAuth error", nonOAuth),
        })
        : null; // evita inicializar hook sem clientId

    return (
        <CadastroLayout
            etapaAtual={3}
            onVoltar={() => navigate('/cadastro/etapa3')}
            onProximo={handleAvancar}
            textoBotaoProximo="Finalizar cadastro"
        >
            <div>
                <InputDiacono
                    label="Email *"
                    placeholder="Digite seu email"
                    value={dadosCadastro.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                />
                {erros.email && <div className="text-red-500 text-sm mt-1">{erros.email}</div>}
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <InputSenhaDiacono
                        texto="Senha *"
                        placeholder="Digite sua senha"
                        value={dadosCadastro.senha}
                        onChange={(e) => handleChange("senha", e.target.value)}
                    />
                </div>
                <div>
                    <InputSenhaDiacono
                        texto="Confirmar Senha *"
                        placeholder="Confirme a senha"
                        value={dadosCadastro.confirmarSenha}
                        onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                        onBlur={() => handleBlur("confirmarSenha")}
                    />
                    {erros.confirmarSenha && <div className="text-red-500 text-sm mt-1">{erros.confirmarSenha}</div>}
                </div>
            </div>
            
            {/* Validação visual da senha */}
            <ValidacaoSenha senha={dadosCadastro.senha} />
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </CadastroLayout>
    );
}