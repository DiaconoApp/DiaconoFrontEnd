import { useState, useEffect } from "react";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { formatarCpf, formatarTelefone, validaEmail } from "../../../utils/Utils";
import { buscarMembroPorId, atualizarMembro } from "../../../services/membros";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { Button } from "@/components/ui/button";
import { AlertModal } from "../../ui/AlertModal";
import { X, Save, ChevronLeft, ChevronDown } from "lucide-react";

const cargosOptions = [
    { value: "MEMBRO", label: "Membro" },
    { value: "LIDER_MINISTERIO", label: "Líder de Ministério" },
    { value: "GOVERNO", label: "Governo" },
];

const funcoesOptions = [
    { value: "", label: "Nenhuma" },
    { value: "MUSICO", label: "Músico" },
    { value: "CANTOR", label: "Cantor" },
    { value: "PREGADOR", label: "Pregador" },
    { value: "INTERCESSOR", label: "Intercessor" },
    { value: "DIACONO", label: "Diácono" },
];

export function FormEditarMembro({ idMembro, fecharFormulario }) {
    const [erros, setErros] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [modal, setModal] = useState(null);
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
        rua: "",
        bairro: "",
        cidade: "",
        numero: "",
        complemento: "",
    });

    // Carregar dados do membro
    useEffect(() => {
        async function carregarMembro() {
            try {
                setCarregando(true);
                const membro = await buscarMembroPorId(idMembro);
                
                setDadosMembro({
                    nome: membro.nome || "",
                    dataNascimento: membro.dataNascimento || "",
                    cpf: membro.cpf || "",
                    email: membro.email || "",
                    celular: membro.celular || "",
                    cargo: membro.cargo || "MEMBRO",
                    funcaoMembro: membro.funcaoMembro || "",
                    generoMembro: membro.generoMembro || "",
                    confirmacaoFe: membro.dataRegistro || "",
                    cep: membro.membroEnderecoDTO?.cep || "",
                    rua: membro.membroEnderecoDTO?.rua || "",
                    bairro: membro.membroEnderecoDTO?.bairro || "",
                    cidade: membro.membroEnderecoDTO?.cidade || "",
                    numero: membro.membroEnderecoDTO?.numero || "",
                    complemento: membro.membroEnderecoDTO?.complemento || "",
                });
            } catch (err) {
                console.error("Erro ao carregar membro:", err);
                setModal({ type: "error", title: "Erro", message: "Erro ao carregar dados do membro." });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar campos
        if (!dadosMembro.nome?.trim()) {
            setModal({ type: "warning", title: "Campo obrigatório", message: "Nome é obrigatório." });
            return;
        }

        try {
            setSalvando(true);
            await atualizarMembro(idMembro, dadosMembro);
            setModal({ type: "success", title: "Sucesso", message: "Membro atualizado com sucesso!", autoClose: 1500 });
            setTimeout(() => fecharFormulario(), 1500);
        } catch (err) {
            setModal({ type: "error", title: "Erro", message: "Erro ao atualizar membro. Tente novamente." });
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

    const modalEl = modal && <AlertModal {...modal} onClose={() => setModal(null)} />;

    return (
        <div className="flex flex-col gap-6">
            {modalEl}
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

                    {/* Sexo e Confirmação na Fé */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-icf-primary-400">Sexo</label>
                            <div className="relative">
                                <select
                                    value={dadosMembro.generoMembro}
                                    onChange={(e) => handleChange("generoMembro", e.target.value)}
                                    className="w-full appearance-none text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 pr-11 focus:outline-none focus:ring-2 focus:ring-icf-primary-200 focus:border-icf-primary-300 transition-colors"
                                >
                                    <option value="">Selecione</option>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMININO">Feminino</option>
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-icf-primary-300">
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                        <InputIcf
                            label="Confirmação na Fé"
                            type="date"
                            value={dadosMembro.confirmacaoFe}
                            onChange={(e) => handleChange("confirmacaoFe", e.target.value)}
                        />
                    </div>

                    {/* Função do Membro */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-icf-primary-400">Função do Membro</label>
                            <div className="relative">
                                <select
                                    value={dadosMembro.funcaoMembro}
                                    onChange={(e) => handleChange("funcaoMembro", e.target.value)}
                                    className="w-full appearance-none text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 pr-11 focus:outline-none focus:ring-2 focus:ring-icf-primary-200 focus:border-icf-primary-300 transition-colors"
                                >
                                    {funcoesOptions.map((f) => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-icf-primary-300">
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Separador - Endereço */}
                    <div className="border-t border-icf-primary-50 pt-6">
                        <h3 className="font-semibold text-icf-primary-400 mb-4">Endereço</h3>
                        
                        {/* CEP, Número, Complemento */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <InputIcf
                                label="CEP"
                                placeholder="00000-000"
                                value={dadosMembro.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                            />
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

                        {/* Logradouro */}
                        <div className="mb-4">
                            <InputIcf
                                label="Logradouro"
                                placeholder=""
                                value={dadosMembro.rua}
                                onChange={(e) => handleChange("rua", e.target.value)}
                                disabled={!!dadosMembro.rua}
                            />
                        </div>

                        {/* Bairro, Cidade */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputIcf
                                label="Bairro"
                                placeholder=""
                                value={dadosMembro.bairro}
                                onChange={(e) => handleChange("bairro", e.target.value)}
                                disabled={!!dadosMembro.bairro}
                            />
                            <InputIcf
                                label="Cidade"
                                placeholder=""
                                value={dadosMembro.cidade}
                                onChange={(e) => handleChange("cidade", e.target.value)}
                                disabled={!!dadosMembro.cidade}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
