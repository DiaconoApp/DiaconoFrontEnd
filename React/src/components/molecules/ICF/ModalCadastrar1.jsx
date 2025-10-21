import { useState } from "react";
import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { InputSenhaIcf } from "../../atoms/ICF/InputSenhaIcf";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf } from "../../../utils/Utils";
import { useCadastro } from "../../../context/CadastroContext";

export function ModalCadastrar1({ onClose, onNext }) {
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const [erros, setErros] = useState({});
    const { validarNome, validarCpf } = useValidacaoCadastro();

    const handleChange = (campo, valor) => {
        let novoValor = valor;

        if (campo === "nome") {
            novoValor = validarNome(valor);
        }

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

    const handleAvancar = () => {
        onNext(dadosCadastro);
    };

    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Cadastrar Novo Membro"} onClick={onClose} />
                <div className="border border-icf-primary-50"></div>
                <EtapasCadastro
                    corLinha="border-[#D9D9D9]"
                    corTexto="text-icf-primary-400"
                    className1="bg-icf-primary-200 text-icf-primary-300"
                    className2="bg-icf-primary-100 text-icf-primary-300"
                />
                <div className="w-full">
                    <InputIcf
                        label="Nome Completo"
                        value={dadosCadastro.nome}
                        onChange={(e) => handleChange("nome", e.target.value)} />
                </div>
                <div className="flex gap-14">
                    <div className="w-full">
                        <InputIcf
                            label="CPF"
                            value={formatarCpf(dadosCadastro.cpf) || dadosCadastro.cpf}
                            onChange={(e) => handleChange("cpf", e.target.value)}
                        />
                        {erros.cpf && <div className="text-red-500 text-sm mt-1">{erros.cpf}</div>}
                    </div>
                    <div className="w-full">
                        <InputIcf
                            label="Data de Nascimento"
                            type="date"
                            value={dadosCadastro.nascimento}
                            onChange={(e) => handleChange("nascimento", e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-14">
                    <div className="w-full">
                        <InputIcf
                            label="Email"
                            value={dadosCadastro.email}
                            onChange={(e) => handleChange("email", e.target.value)} />
                    </div>
                    <div className="w-full">
                        <InputIcf
                            label="Celular"
                            value={dadosCadastro.celular}
                            onChange={(e) => handleChange("celular", e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-14">
                    <div className="w-full">
                        <InputSenhaIcf
                            texto="Senha"
                            value={dadosCadastro.senha}
                            onChange={(e) => handleChange("senha", e.target.value)}
                        />

                    </div>
                    <div className="w-full">
                        <InputSenhaIcf
                            texto="Confirmar Senha"
                            value={dadosCadastro.confirmarSenha}
                            onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                        />

                    </div>
                </div>
                <div className="w-full flex justify-center gap-25">
                    <div className="w-[30%]">
                        <BotaoIcf className="bg-icf-primary-400 flex items-center justify-center gap-2" onClick={handleAvancar}>
                            Próximo
                        </BotaoIcf>
                    </div>
                </div>
            </div>
        </div>
    );
}