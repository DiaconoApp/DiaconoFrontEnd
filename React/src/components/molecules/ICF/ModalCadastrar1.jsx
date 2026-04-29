import { useState } from "react";
import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { InputSenhaIcf } from "../../atoms/ICF/InputSenhaIcf";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, isTelefone, validaEmail } from "../../../utils/Utils";
import { useCadastro } from "../../../context/CadastroContext";

export function ModalCadastrar1({ onClose, onNext }) {
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

            case "email":
                const emailValido = validaEmail(valor);
                setErros((prev) => ({
                    ...prev,
                    email: emailValido ? undefined : "Email inválido",
                }));
                break;

            case "celular":
                const celularValido = isTelefone(valor);
                setErros((prev) => ({
                    ...prev,
                    celular: celularValido ? undefined : "Celular inválido",
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
        onNext(dadosCadastro);
    };

    return (
        <BaseModal
            title="Cadastrar Novo Membro"
            onClose={onClose}
            size="lg"
            footer={
                <Button
                    onClick={handleAvancar}
                    className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white px-8"
                >
                    Próximo
                </Button>
            }
        >
            <div className="space-y-4">
                <EtapasCadastro
                    corLinha="border-[#D9D9D9]"
                    corTexto="text-icf-primary-400"
                    className1="bg-icf-primary-200 text-icf-primary-300"
                    className2="bg-icf-primary-100 text-icf-primary-300"
                />
                <InputIcf
                    label="Nome Completo"
                    value={dadosCadastro.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    onBlur={() => handleBlur("nome")}
                />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <InputIcf
                            label="CPF"
                            value={formatarCpf(dadosCadastro.cpf) || dadosCadastro.cpf}
                            onChange={(e) => handleChange("cpf", e.target.value)}
                            onBlur={() => handleBlur("cpf")}
                        />
                        {erros.cpf && <div className="text-red-500 text-sm mt-1">{erros.cpf}</div>}
                    </div>
                    <div className="flex-1">
                        <InputIcf
                            label="Data de Nascimento"
                            type="date"
                            value={dadosCadastro.dataNascimento} 
                            onChange={(e) => handleChange("dataNascimento", e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <InputIcf
                            label="Email"
                            value={dadosCadastro.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onBlur={() => handleBlur("email")}
                        />
                        {erros.email && <div className="text-red-500 text-sm mt-1">{erros.email}</div>}
                    </div>
                    <div className="flex-1">
                        <InputIcf
                            label="Celular"
                            value={formatarTelefone(dadosCadastro.celular) || dadosCadastro.celular}
                            onChange={(e) => handleChange("celular", e.target.value)}
                            onBlur={() => handleBlur("celular")}
                        />
                        {erros.celular && <div className="text-red-500 text-sm mt-1">{erros.celular}</div>}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <InputSenhaIcf
                            texto="Senha"
                            value={dadosCadastro.senha}
                            onChange={(e) => handleChange("senha", e.target.value)}
                            onBlur={() => handleBlur("senha")}
                        />
                        {erros.senha && <div className="text-red-500 text-sm mt-1">{erros.senha}</div>}
                    </div>
                    <div className="flex-1">
                        <InputSenhaIcf
                            texto="Confirmar Senha"
                            value={dadosCadastro.confirmarSenha}
                            onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                            onBlur={() => handleBlur("confirmarSenha")}
                        />
                        {erros.confirmarSenha && <div className="text-red-500 text-sm mt-1">{erros.confirmarSenha}</div>}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}