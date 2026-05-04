import { useState, useEffect } from "react";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, validaEmail } from "../../../utils/Utils";
import { buscarMembroPorId, atualizarMembro } from "../../../services/membros";
import { buscarMinisterios } from "../../../services/ministerios";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { Button } from "@/components/ui/button";
import { Save, ChevronLeft, Church } from "lucide-react";

export function FormEditarMembro({ idMembro, fecharFormulario }) {
    const [erros, setErros] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [dadosOriginais, setDadosOriginais] = useState(null);
    const [optionsMinisterios, setOptionsMinisterios] = useState([]);
    const { validarNome, validarCpf, buscarEnderecoPorCep } = useValidacaoCadastro();

    const [dadosMembro, setDadosMembro] = useState({
        nome: "",
        dataNascimento: "",
        cpf: "",
        email: "",
        celular: "",
        cargo: "MEMBRO",
        funcaoMembro: "",
        generoMembro: "",
        confirmacaoFe: "",
        cep: "",
        estado: "",
        rua: "",
        bairro: "",
        cidade: "",
        numero: "",
        complemento: "",
        ministerios: [],
    });

    useEffect(() => {
        buscarMinisterios({})
            .then((res) => setOptionsMinisterios(res.content || []))
            .catch((err) => {
                console.error("Erro ao buscar ministérios:", err);
                setOptionsMinisterios([]);
            });
    }, []);

    // Carregar dados do membro
    useEffect(() => {
        async function carregarMembro() {
            try {
                setCarregando(true);
                const membro = await buscarMembroPorId(idMembro);

                const dadosMapeados = {
                    nome: membro.nome || "",
                    dataNascimento: membro.dataNascimento ? String(membro.dataNascimento).slice(0, 10) : "",
                    cpf: membro.cpf || "",
                    email: membro.email || "",
                    celular: membro.celular || "",
                    cargo: membro.cargo || "MEMBRO",
                    funcaoMembro: membro.funcaoMembro || "",
                    generoMembro: membro.generoMembro || "",
                    confirmacaoFe: membro.confirmacaoFe || "",
                    cep: membro.membroEnderecoDTO?.cep || "",
                    estado: membro.membroEnderecoDTO?.estado || "",
                    rua: membro.membroEnderecoDTO?.rua || "",
                    bairro: membro.membroEnderecoDTO?.bairro || "",
                    cidade: membro.membroEnderecoDTO?.cidade || "",
                    numero: membro.membroEnderecoDTO?.numero || "",
                    complemento: membro.membroEnderecoDTO?.complemento || "",
                    ministerios: (membro.ministerios || []).map((ministerio) => ({
                        idExternoMinisterio: ministerio.idExternoMinisterio || ministerio.idExterno || "",
                        cargo: "MEMBRO",
                    })),
                };

                setDadosMembro(dadosMapeados);
                setDadosOriginais(dadosMapeados);
            } catch (err) {
                console.error("Erro ao carregar membro:", err);
                alert("Erro ao carregar dados do membro");
            } finally {
                setCarregando(false);
            }
        }

        if (idMembro) {
            carregarMembro();
        }
    }, [idMembro]);

    const handleCepChange = async (cep) => {
        handleChange("cep", cep);
        if (cep.replace(/\D/g, "").length === 8) {
            const endereco = await buscarEnderecoPorCep(cep.replace(/\D/g, ""));
            if (endereco) {
                handleChange("rua", endereco.rua);
                handleChange("bairro", endereco.bairro);
                handleChange("cidade", endereco.cidade);
                handleChange("estado", endereco.uf);
            }
        }
    };

    const handleChange = (campo, valor) => {
        if (campo === "cpf") {
            const cpfValido = validarCpf(valor);
            setErros((prev) => ({
                ...prev,
                cpf: cpfValido ? undefined : "CPF inválido",
            }));
        }

        setDadosMembro((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleBlur = (campo) => {
        const valor = dadosMembro[campo];

        switch (campo) {
            case "nome":
                const nomeCorrigido = validarNome(valor);
                setDadosMembro((prev) => ({ ...prev, nome: nomeCorrigido }));
                break;

            case "email":
                if (valor) {
                    const emailValido = validaEmail(valor);
                    setErros((prev) => ({
                        ...prev,
                        email: emailValido ? undefined : "Email inválido",
                    }));
                }
                break;
        }
    };

    const handleAddMinisterio = () => {
        setDadosMembro((prev) => ({
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
        setDadosMembro((prev) => {
            const ministerios = [...(prev.ministerios || [])];
            ministerios[index] = { ...ministerios[index], [campo]: valor };
            return {
                ...prev,
                ministerios,
            };
        });
    };

    const handleRemoveMinisterio = (index) => {
        setDadosMembro((prev) => ({
            ...prev,
            ministerios: (prev.ministerios || []).filter((_, i) => i !== index),
        }));
    };

    const montarPayloadAlterado = () => {
        if (!dadosOriginais) return {};

        const payload = {};
        const camposSimples = [
            "nome",
            "cpf",
            "email",
            "celular",
            "cargo",
            "funcaoMembro",
            "generoMembro",
            "confirmacaoFe",
        ];

        camposSimples.forEach((campo) => {
            const original = dadosOriginais?.[campo] ?? "";
            const atual = dadosMembro?.[campo] ?? "";
            if (String(original) !== String(atual)) {
                payload[campo] = atual;
            }
        });

        const dataOriginal = dadosOriginais?.dataNascimento ? String(dadosOriginais.dataNascimento).slice(0, 10) : "";
        const dataAtual = dadosMembro?.dataNascimento ? String(dadosMembro.dataNascimento).slice(0, 10) : "";
        if (dataOriginal !== dataAtual && dataAtual) {
            payload.dataNascimento = dataAtual;
        }

        const enderecoAtual = {
            cep: dadosMembro.cep,
            estado: dadosMembro.estado,
            bairro: dadosMembro.bairro,
            cidade: dadosMembro.cidade,
            rua: dadosMembro.rua,
            numero: dadosMembro.numero,
            complemento: dadosMembro.complemento,
        };

        const enderecoOriginal = {
            cep: dadosOriginais.cep,
            estado: dadosOriginais.estado,
            bairro: dadosOriginais.bairro,
            cidade: dadosOriginais.cidade,
            rua: dadosOriginais.rua,
            numero: dadosOriginais.numero,
            complemento: dadosOriginais.complemento,
        };

        const houveAlteracaoEndereco = Object.keys(enderecoAtual).some((campo) => {
            const original = enderecoOriginal?.[campo] ?? "";
            const atual = enderecoAtual?.[campo] ?? "";
            return String(original) !== String(atual);
        });

        if (houveAlteracaoEndereco) {
            payload.membroEnderecoDTO = enderecoAtual;
        }

        const ministeriosOriginais = (dadosOriginais.ministerios || [])
            .map((m) => m.idExternoMinisterio)
            .filter(Boolean)
            .sort();
        const ministeriosAtuais = (dadosMembro.ministerios || [])
            .map((m) => m.idExternoMinisterio)
            .filter(Boolean)
            .sort();

        if (JSON.stringify(ministeriosOriginais) !== JSON.stringify(ministeriosAtuais)) {
            payload.idExternoMinisterios = ministeriosAtuais;
        }

        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar campos
        if (!dadosMembro.nome?.trim()) {
            alert("Nome é obrigatório");
            return;
        }

        try {
            setSalvando(true);
            const payloadAlterado = montarPayloadAlterado();

            if (Object.keys(payloadAlterado).length === 0) {
                alert("Nenhuma alteração para salvar");
                return;
            }

            await atualizarMembro(idMembro, payloadAlterado);
            alert("Membro atualizado com sucesso!");
            fecharFormulario();
        } catch (err) {
            alert("Erro ao atualizar membro. Tente novamente.");
            console.error(err);
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-icf-primary-300">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fecharFormulario}
                        className="p-1 hover:bg-icf-primary-50 rounded transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-icf-primary-400" />
                    </button>
                    <h1 className="font-bold text-xl text-icf-primary-400 uppercase tracking-tight">
                        Editar Membro
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={fecharFormulario}
                        className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                    >
                        Cancelar
                    </Button>
                    <Button
                        form="form-editar-membro"
                        type="submit"
                        disabled={salvando}
                        className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Salvar
                    </Button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm p-8">
                <form id="form-editar-membro" onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* Nome Completo - Full Width */}
                    <div>
                        <InputIcf
                            label="Nome Completo"
                            placeholder="João Silva Santos"
                            value={dadosMembro.nome}
                            onChange={(e) => handleChange("nome", e.target.value)}
                            onBlur={() => handleBlur("nome")}
                        />
                    </div>

                    {/* Data Nascimento, CPF, Telefone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputIcf
                            label="Data de Nascimento"
                            type="date"
                            placeholder="dd/mm/aaaa"
                            value={dadosMembro.dataNascimento}
                            onChange={(e) => handleChange("dataNascimento", e.target.value)}
                        />
                        <div className="w-full">
                            <InputIcf
                                label="CPF"
                                placeholder="000.000.000-00"
                                value={formatarCpf(dadosMembro.cpf) || dadosMembro.cpf}
                                onChange={(e) => handleChange("cpf", e.target.value)}
                            />
                            {erros.cpf && <div className="text-danger-500 text-sm mt-1">{erros.cpf}</div>}
                        </div>
                        <div className="w-full">
                            <InputIcf
                                label="Telefone"
                                placeholder="(11) 99999-1234"
                                value={formatarTelefone(dadosMembro.celular) || dadosMembro.celular}
                                onChange={(e) => handleChange("celular", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email - Full Width */}
                    <div>
                        <InputIcf
                            label="Email"
                            placeholder="joao.silva@email.com"
                            value={dadosMembro.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onBlur={() => handleBlur("email")}
                        />
                        {erros.email && <div className="text-danger-500 text-sm mt-1">{erros.email}</div>}
                    </div>

                    {/* Sexo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-icf-primary-400">Sexo</label>
                            <select
                                value={dadosMembro.generoMembro}
                                onChange={(e) => handleChange("generoMembro", e.target.value)}
                                className="w-full text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                            >
                                <option value="">Selecione</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                        </div>
                    </div>

                    {/* Seção: Ministério */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-icf-primary-50">
                            <Church className="w-5 h-5 text-icf-primary-400" />
                            <h3 className="font-semibold text-icf-primary-400">Ministérios e Cargo por Ministério</h3>
                        </div>

                        {(dadosMembro.ministerios || []).length === 0 ? (
                            <p className="text-sm text-icf-primary-300">Nenhum ministério selecionado.</p>
                        ) : (
                            <div className="space-y-3">
                                {(dadosMembro.ministerios || []).map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="text-sm font-medium text-icf-primary-400">Ministério</label>
                                            <select
                                                value={item.idExternoMinisterio}
                                                onChange={(e) => handleUpdateMinisterio(index, "idExternoMinisterio", e.target.value)}
                                                className="w-full text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                                            >
                                                <option value="">Selecione o ministério</option>
                                                {optionsMinisterios.map((opt) => (
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

                    {/* Separador - Endereço */}
                    <div className="border-t border-icf-primary-50 pt-6">
                        <h3 className="font-semibold text-icf-primary-400 mb-4">Endereço</h3>
                        
                        {/* CEP, Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputIcf
                                label="CEP"
                                placeholder="00000-000"
                                value={dadosMembro.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                            />
                            <InputIcf
                                label="Estado"
                                placeholder="SP"
                                value={dadosMembro.estado}
                                onChange={(e) => handleChange("estado", e.target.value)}
                            />
                        </div>

                        {/* Cidade, Bairro */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputIcf
                                label="Cidade"
                                placeholder=""
                                value={dadosMembro.cidade}
                                onChange={(e) => handleChange("cidade", e.target.value)}
                            />
                            <InputIcf
                                label="Bairro"
                                placeholder=""
                                value={dadosMembro.bairro}
                                onChange={(e) => handleChange("bairro", e.target.value)}
                            />
                        </div>

                        {/* Logradouro */}
                        <div className="mb-4">
                            <InputIcf
                                label="Logradouro"
                                placeholder=""
                                value={dadosMembro.rua}
                                onChange={(e) => handleChange("rua", e.target.value)}
                            />
                        </div>

                        {/* Número, Complemento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputIcf
                                label="Número"
                                placeholder=""
                                value={dadosMembro.numero}
                                onChange={(e) => handleChange("numero", e.target.value)}
                            />
                            <InputIcf
                                label="Complemento"
                                placeholder=""
                                value={dadosMembro.complemento}
                                onChange={(e) => handleChange("complemento", e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
