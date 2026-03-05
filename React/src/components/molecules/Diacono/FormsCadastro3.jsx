import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { InputSenhaDiacono } from "../../atoms/Diacono/InputSenhaDiacono";
import { ValidacaoSenha } from "../../atoms/Diacono/ValidacaoSenha";
import { CadastroLayout } from "../../templates/Diacono/CadastroLayout";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { validaEmail } from "../../../utils/Utils";
import { useState } from "react";

export function FormsCadastro3() {
    const navigate = useNavigate();
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const [erros, setErros] = useState({});

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

    const handleAvancar = () => {
        const camposObrigatorios = ["email", "senha", "confirmarSenha"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

        if (camposVazios.length > 0) {
            alert("Preencha todos os campos para continuar.");
            return;
        }

        if (!validarSenhaForte(dadosCadastro.senha)) {
            alert("A senha deve atender todos os requisitos de segurança.");
            return;
        }

        if (dadosCadastro.senha !== dadosCadastro.confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        if (Object.values(erros).some(e => e)) {
            alert("Corrija os erros antes de continuar.");
            return;
        }

        navigate("/cadastro/etapa4");
    };

    return (
        <CadastroLayout
            etapaAtual={2}
            onVoltar={() => navigate('/cadastro/etapa2')}
            onProximo={handleAvancar}
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
        </CadastroLayout>
    );
}