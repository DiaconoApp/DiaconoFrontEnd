import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { InputSenhaDiacono } from "../../atoms/Diacono/InputSenhaDiacono";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { BotaoGoogle } from "../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../atoms/Global/LinkAcesso";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import api from "../../../provider/api";
import { validaEmail } from "../../../utils/Utils";
import { useState } from "react";
import { AlertModal } from "../../ui/AlertModal";

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

            case "senha":
                const senhaValida = valor?.length >= 8;
                setErros((prev) => ({
                    ...prev,
                    senha: senhaValida ? undefined : "Senha muito curta",
                }));
                const confirmarSenha = dadosCadastro.confirmarSenha;
                if (confirmarSenha) {
                    const senhasConferem = valor === confirmarSenha;
                    setErros((prev) => ({
                        ...prev,
                        confirmarSenha: senhasConferem ? undefined : "Senhas não coincidem",
                    }));
                }
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

    return (

        <div className="w-[55%] flex flex-col gap-5">
            <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
            <EtapasCadastro corLinha="border-diacono-blue-100" corTexto="text-diacono-blue-200" className1="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className2="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className3="bg-diacono-blue-400 text-white" />
            <div className="flex flex-col gap-5">
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
                <div className="flex justify-between">
                    <div>
                        <InputSenhaDiacono
                            texto="Senha *"
                            placeholder="Digite sua senha"
                            value={dadosCadastro.senha}
                            onChange={(e) => handleChange("senha", e.target.value)}
                            onBlur={() => handleBlur("senha")}
                        />
                        {erros.senha && <div className="text-red-500 text-sm mt-1">{erros.senha}</div>}
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
                <div className='flex flex-col gap-3 items-end'>
                    <div className="w-full flex gap-40">
                        <BotaoDiacono onClick={() => navigate('/cadastro/etapa3')}>Voltar</BotaoDiacono>
                        <BotaoDiacono onClick={handleAvancar}>Finalizar cadastro</BotaoDiacono>
                    </div>
                    <BotaoGoogle>Entrar com o Google</BotaoGoogle>
                    <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
                </div>
            </div>
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </div >
    );
}