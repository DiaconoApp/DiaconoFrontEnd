import { useState, useEffect } from "react";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { InputSenhaIcf } from "../../atoms/ICF/InputSenhaIcf";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, isTelefone, validaEmail } from "../../../utils/Utils";
import { buscarMinisterios } from "../../../services/ministerios";
import { cadastrarMembro } from "../../../services/membros";

export function FormMembro({ fecharFormulario }) {
    const [erros, setErros] = useState({});
    const { validarNome, validarCpf, validarCamposObrigatorios } = useValidacaoCadastro();

    const [dadosCadastro, setDadosCadastro] = useState({
        fkIgreja: localStorage.getItem("fk_igreja"),
        nome: "",
        dataNascimento: "",
        cpf: "",
        email: "",
        celular: "",
        senha: "",
        confirmarSenha: "",
        idExternoMinisterios: "",
        cargo: "MEMBRO",
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        numero: "",
        complemento: "",
    });

    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarMinisterios({})
            .then((res) => setOptions(res.content || []));
    }, []);

    const { buscarEnderecoPorCep } = useValidacaoCadastro();
    const handleCepChange = async (cep) => {
        handleChange("cep", cep);
        if (cep.length === 8) {
            const endereco = await buscarEnderecoPorCep(cep);
            if (endereco) {
                handleChange("rua", endereco.rua);
                handleChange("bairro", endereco.bairro);
                handleChange("cidade", endereco.cidade);
                handleChange("estado", endereco.uf);
            }
        }
    };

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

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const erros = validarCamposObrigatorios(dadosCadastro);
        if (erros.length > 0) {
            alert("Erro no cadastro:\n" + erros.join("\n"));
            return;
        }

        try {
            await cadastrarMembro(dadosCadastro);
            alert("Membro cadastrado com sucesso!");

            if (typeof fecharFormulario === "function") fecharFormulario(false);

            // resetar dados para o estado inicial (não para um objeto vazio)
            setDadosCadastro({
                fkIgreja: localStorage.getItem("fk_igreja"),
                nome: "",
                dataNascimento: "",
                cpf: "",
                email: "",
                celular: "",
                senha: "",
                confirmarSenha: "",
                idExternoMinisterios: "",
                cargo: "MEMBRO",
                cep: "",
                rua: "",
                bairro: "",
                cidade: "",
                numero: "",
                complemento: "",
            });
        } catch (err) {
            alert("Erro ao cadastrar membro. Verifique os dados e tente novamente.");
            console.error(err);
        }
    };

    return (
        <div className="flex w-full">
            <div className="bg-white rounded-l-lg p-6 w-[80%]">
                <h2 className="text-2xl font-bold tracking-[-0.4px] mb-4">Cadastrar Membro</h2>

                <div className="">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <InputIcf
                                label="Nome Completo"
                                placeholder={"Digite o nome completo"}
                                value={dadosCadastro.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                onBlur={() => handleBlur("nome")}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full">
                            <InputIcf
                                label="Data de Nascimento"
                                type="date"
                                value={dadosCadastro.dataNascimento}
                                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                            />
                            <div className="w-full">
                                <InputIcf
                                    label="CPF"
                                    placeholder={"Digite o cpf"}
                                    value={formatarCpf(dadosCadastro.cpf) || dadosCadastro.cpf}
                                    onChange={(e) => handleChange("cpf", e.target.value)}
                                    onBlur={() => handleBlur("cpf")}

                                />
                                {erros.cpf && <div className="text-red-500 text-sm mt-1">{erros.cpf}</div>}
                            </div>
                            <div className="w-full">
                                <InputIcf
                                    label="Celular"
                                    placeholder={"Ex: (11) 91234-5678"}
                                    value={formatarTelefone(dadosCadastro.celular) || dadosCadastro.celular}
                                    onChange={(e) => handleChange("celular", e.target.value)}
                                    onBlur={() => handleBlur("celular")}
                                />
                                {erros.celular && <div className="text-red-500 text-sm mt-1">{erros.celular}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="w-full">
                                <InputIcf
                                    label="Email"
                                    placeholder={"Digite o email"}
                                    value={dadosCadastro.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    onBlur={() => handleBlur("email")}
                                />
                                {erros.email && <div className="text-red-500 text-sm mt-1">{erros.email}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="w-full">
                                <InputSenhaIcf
                                    texto="Senha"
                                    placeholder={"Digite a senha"}
                                    value={dadosCadastro.senha}
                                    onChange={(e) => handleChange("senha", e.target.value)}
                                    onBlur={() => handleBlur("senha")}
                                />
                                {erros.senha && <div className="text-red-500 text-sm mt-1">{erros.senha}</div>}
                            </div>
                            <div className="w-full">
                                <InputSenhaIcf
                                    texto="Confirmar Senha"
                                    placeholder={"Confirme a senha"}
                                    value={dadosCadastro.confirmarSenha}
                                    onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                                    onBlur={() => handleBlur("confirmarSenha")}
                                />
                                {erros.confirmarSenha && <div className="text-red-500 text-sm mt-1">{erros.confirmarSenha}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <SelectIcf
                                opt1={<option value="">Nenhum</option>}
                                label="Ministério"
                                options={options}
                                value={dadosCadastro.idExternoMinisterios}
                                onChange={(valor) => handleChange("idExternoMinisterios", valor)}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full">
                            <InputIcf
                                label="CEP"
                                placeholder={"Digite o CEP"}
                                value={dadosCadastro.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full">
                            <InputIcf
                                label="Rua/Avenida"
                                placeholder={"Digite a rua"}
                                value={dadosCadastro.rua}
                                onChange={(e) => handleChange("rua", e.target.value)}
                                disabled={!!dadosCadastro.rua}
                            />
                            <InputIcf
                                label="Bairro"
                                placeholder={"Digite o bairro"}
                                value={dadosCadastro.bairro}
                                onChange={(e) => handleChange("bairro", e.target.value)}
                                disabled={!!dadosCadastro.bairro} />
                            <InputIcf
                                label="Cidade"
                                placeholder={"Digite a cidade"}
                                value={dadosCadastro.cidade}
                                onChange={(e) => handleChange("cidade", e.target.value)}
                                disabled={!!dadosCadastro.cidade} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full">
                            <InputIcf
                                label="Número"
                                placeholder={"Digite o número"}
                                value={dadosCadastro.numero}
                                onChange={(e) => handleChange("numero", e.target.value)} />
                            <InputIcf
                                label="Complemento"
                                placeholder={"Digite o complemento"}
                                value={dadosCadastro.complemento}
                                onChange={(e) => handleChange("complemento", e.target.value)} />
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                            <button onClick={fecharFormulario} type="button" className="px-8 py-3 rounded-lg bg-icf-primary-200 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                                Cancelar
                            </button>
                            <button type="submit" className="py-3 px-8 rounded-lg bg-icf-primary-400 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                                Cadastrar Membro
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="bg-white border-l rounded-r-lg py-4 px-9 border-icf-primary-100"></div>
        </div>
    );
}