import { useState, useEffect } from "react";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { InputSenhaIcf } from "../../atoms/ICF/InputSenhaIcf";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, isTelefone, validaEmail } from "../../../utils/Utils";
import { buscarMinisterios } from "../../../services/ministerios";
import { cadastrarMembro } from "../../../services/membros";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { Button } from "@/components/ui/button";
import { X, Save, User, Lock, Church, MapPin } from "lucide-react";
import { AlertModal } from "../../ui/AlertModal";

export function FormMembro({ fecharFormulario }) {
    const [erros, setErros] = useState({});
    const { validarNome, validarCpf, validarCamposObrigatorios } = useValidacaoCadastro();
    const [modal, setModalAviso] = useState(null);

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
        ministerios: [],
        generoMembro: "",
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

    const handleAddMinisterio = () => {
        setDadosCadastro((prev) => ({
            ...prev,
            ministerios: [
                ...prev.ministerios,
                {
                    idExternoMinisterio: "",
                    cargo: "MEMBRO",
                },
            ],
        }));
    };

    const handleUpdateMinisterio = (index, campo, valor) => {
        setDadosCadastro((prev) => {
            const ministerios = [...prev.ministerios];
            ministerios[index] = { ...ministerios[index], [campo]: valor };
            return {
                ...prev,
                ministerios,
            };
        });
    };

    const handleRemoveMinisterio = (index) => {
        setDadosCadastro((prev) => ({
            ...prev,
            ministerios: prev.ministerios.filter((_, i) => i !== index),
        }));
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

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const erros = validarCamposObrigatorios(dadosCadastro);
        if (erros.length > 0) {
            // alert("Erro no cadastro:\n" + erros.join("\n"));
             setModalAviso({
                type: "error",
                title: "Ocorreu um problema",
                message: "Erro ao cadastrar, verifique os dados inseridos."
              });
            return;
        }

        try {
            await cadastrarMembro(dadosCadastro);
            setModalAviso({
                type: "success",
                title: "Cadastro realizado",
                message: "Membro cadastrado com sucesso!",
                autoClose: 2000
            });

            setTimeout(() => {
                if (typeof fecharFormulario === "function") fecharFormulario(false);
            }, 2000);

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
                ministerios: [],
                generoMembro: "",
                cep: "",
                rua: "",
                bairro: "",
                cidade: "",
                numero: "",
                complemento: "",
            });
        } catch (err) {
           setModalAviso({
                type: "error",
                title: "Ocorreu um problema",
                message: "Erro ao cadastrar membro, verifique os dados e tente novamente."
              });
            console.error(err + 'caiu aqui');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <PageHeader
                titulo="Cadastrar Membro"
                descricao="Preencha os dados do novo membro"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={fecharFormulario}
                    className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancelar
                </Button>
                <Button
                    form="form-membro"
                    type="submit"
                    className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white gap-2"
                >
                    <Save className="w-4 h-4" />
                    Cadastrar
                </Button>
            </PageHeader>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm p-8">
                <form id="form-membro" onSubmit={handleSubmit} className="flex flex-col gap-8">
                    
                    {/* Seção: Dados Pessoais */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-icf-primary-50">
                            <User className="w-5 h-5 text-icf-primary-400" />
                            <h3 className="font-semibold text-icf-primary-400">Dados Pessoais</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputIcf
                                label="Nome Completo"
                                placeholder="Digite o nome completo"
                                value={dadosCadastro.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                onBlur={() => handleBlur("nome")}
                            />
                            <div className="w-full">
                                <InputIcf
                                    label="CPF"
                                    placeholder="Digite o CPF"
                                    value={formatarCpf(dadosCadastro.cpf) || dadosCadastro.cpf}
                                    onChange={(e) => handleChange("cpf", e.target.value)}
                                    onBlur={() => handleBlur("cpf")}
                                />
                                {erros.cpf && <div className="text-danger-500 text-sm mt-1">{erros.cpf}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputIcf
                                label="Data de Nascimento"
                                type="date"
                                value={dadosCadastro.dataNascimento}
                                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                            />
                            <div className="w-full">
                                <InputIcf
                                    label="Celular"
                                    placeholder="Ex: (11) 91234-5678"
                                    value={formatarTelefone(dadosCadastro.celular) || dadosCadastro.celular}
                                    onChange={(e) => handleChange("celular", e.target.value)}
                                    onBlur={() => handleBlur("celular")}
                                />
                                {erros.celular && <div className="text-danger-500 text-sm mt-1">{erros.celular}</div>}
                            </div>
                            <div className="w-full">
                                <div className="flex flex-col gap-1">
                                    <label className="text-icf-primary-400 text-sm font-medium">Gênero *</label>
                                    <select
                                        value={dadosCadastro.generoMembro}
                                        onChange={(e) => handleChange("generoMembro", e.target.value)}
                                        className="text-icf-primary-400 border border-icf-primary-200 bg-surface-50 rounded-lg p-[11px] focus:outline-none focus:ring-2 focus:ring-icf-primary-200 text-sm"
                                    >
                                        <option value="" disabled>Selecione o gênero</option>
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <InputIcf
                                    label="Email"
                                    placeholder="Digite o email"
                                    value={dadosCadastro.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    onBlur={() => handleBlur("email")}
                                />
                                {erros.email && <div className="text-danger-500 text-sm mt-1">{erros.email}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Seção: Credenciais */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-icf-primary-50">
                            <Lock className="w-5 h-5 text-icf-primary-400" />
                            <h3 className="font-semibold text-icf-primary-400">Credenciais de Acesso</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <InputSenhaIcf
                                    texto="Senha"
                                    placeholder="Digite a senha"
                                    value={dadosCadastro.senha}
                                    onChange={(e) => handleChange("senha", e.target.value)}
                                    onBlur={() => handleBlur("senha")}
                                />
                                {erros.senha && <div className="text-danger-500 text-sm mt-1">{erros.senha}</div>}
                            </div>
                            <div className="w-full">
                                <InputSenhaIcf
                                    texto="Confirmar Senha"
                                    placeholder="Confirme a senha"
                                    value={dadosCadastro.confirmarSenha}
                                    onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                                    onBlur={() => handleBlur("confirmarSenha")}
                                />
                                {erros.confirmarSenha && <div className="text-danger-500 text-sm mt-1">{erros.confirmarSenha}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Seção: Ministério */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-icf-primary-50">
                            <Church className="w-5 h-5 text-icf-primary-400" />
                            <h3 className="font-semibold text-icf-primary-400">Ministérios e Cargo por Ministério</h3>
                        </div>

                        {dadosCadastro.ministerios.length === 0 ? (
                            <p className="text-sm text-icf-primary-300">Nenhum ministério selecionado.</p>
                        ) : (
                            <div className="space-y-3">
                                {dadosCadastro.ministerios.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="text-sm font-medium text-icf-primary-400">Ministério</label>
                                            <select
                                                value={item.idExternoMinisterio}
                                                onChange={(e) => handleUpdateMinisterio(index, "idExternoMinisterio", e.target.value)}
                                                className="w-full text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                                            >
                                                <option value="">Selecione o ministério</option>
                                                {options.map((opt) => (
                                                    <option key={opt.idExterno} value={opt.idExterno}>
                                                        {opt.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-icf-primary-400">Cargo no ministério</label>
                                            <select
                                                value={item.cargo}
                                                onChange={(e) => handleUpdateMinisterio(index, "cargo", e.target.value)}
                                                className="w-full text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                                            >
                                                <option value="MEMBRO">Membro</option>
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMinisterio(index)}
                                            className="text-danger-500 hover:text-danger-600 font-medium"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleAddMinisterio}
                            className="px-4 py-2 rounded-lg bg-icf-primary-100 text-icf-primary-400 hover:bg-icf-primary-200 transition-colors"
                        >
                            + Adicionar ministério
                        </button>
                    </div>

                    {/* Seção: Endereço */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-icf-primary-50">
                            <MapPin className="w-5 h-5 text-icf-primary-400" />
                            <h3 className="font-semibold text-icf-primary-400">Endereço</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputIcf
                                label="CEP"
                                placeholder="Digite o CEP"
                                value={dadosCadastro.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputIcf
                                label="Rua/Avenida"
                                placeholder="Digite a rua"
                                value={dadosCadastro.rua}
                                onChange={(e) => handleChange("rua", e.target.value)}
                                disabled={!!dadosCadastro.rua}
                            />
                            <InputIcf
                                label="Bairro"
                                placeholder="Digite o bairro"
                                value={dadosCadastro.bairro}
                                onChange={(e) => handleChange("bairro", e.target.value)}
                                disabled={!!dadosCadastro.bairro}
                            />
                            <InputIcf
                                label="Cidade"
                                placeholder="Digite a cidade"
                                value={dadosCadastro.cidade}
                                onChange={(e) => handleChange("cidade", e.target.value)}
                                disabled={!!dadosCadastro.cidade}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputIcf
                                label="Número"
                                placeholder="Digite o número"
                                value={dadosCadastro.numero}
                                onChange={(e) => handleChange("numero", e.target.value)}
                            />
                            <InputIcf
                                label="Complemento"
                                placeholder="Digite o complemento"
                                value={dadosCadastro.complemento}
                                onChange={(e) => handleChange("complemento", e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>
            <div className="bg-white border-l rounded-r-lg py-4 px-9 border-icf-primary-100"></div>
            {modal && <AlertModal {...modal} onClose={() => setModalAviso(null)} />}
        </div>
    );
}