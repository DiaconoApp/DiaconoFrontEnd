import { useState, useEffect } from "react";
import { buscarPerfilLogado, atualizarPerfilLogado, buscarEnderecoPorCep } from "../../../services/perfil";
import { formatarCpf, formatarTelefone, formatarCargo, calcularIdade, safeFormatDate } from "../../../utils/Utils";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { Button } from "@/components/ui/button";
import { 
    User, 
    Phone, 
    Mail, 
    Calendar, 
    MapPin, 
    Church, 
    Edit2, 
    Save, 
    X
} from "lucide-react";

export function Perfil() {
    const [membro, setMembro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [dadosEdicao, setDadosEdicao] = useState({});
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setLoading(true);
            const dados = await buscarPerfilLogado();
            setMembro(dados);
            setDadosEdicao(dados);
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (campo, valor) => {
        setDadosEdicao((prev) => ({ ...prev, [campo]: valor }));
    };

    const normalizarDataNascimentoParaInput = (dataNascimento) => {
        if (!dataNascimento) return "";

        const dataStr = String(dataNascimento);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
            return dataStr;
        }

        const dataBr = safeFormatDate(dataStr);
        const matchDataBr = dataBr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

        if (!matchDataBr) {
            return "";
        }

        const [, dia, mes, ano] = matchDataBr;
        return `${ano}-${mes}-${dia}`;
    };

    const handleCepChange = async (valorCep) => {
        const cepLimpo = (valorCep || "").replace(/\D/g, "");
        handleChange("cep", cepLimpo);

        if (cepLimpo.length !== 8) {
            return;
        }

        const endereco = await buscarEnderecoPorCep(cepLimpo);
        if (!endereco) {
            return;
        }

        setDadosEdicao((prev) => ({
            ...prev,
            cep: cepLimpo,
            rua: endereco.logradouro || prev.rua || prev.membroEnderecoDTO?.rua || "",
            bairro: endereco.bairro || prev.bairro || prev.membroEnderecoDTO?.bairro || "",
            cidade: endereco.localidade || prev.cidade || prev.membroEnderecoDTO?.cidade || "",
            estado: endereco.uf || prev.estado || prev.membroEnderecoDTO?.estado || "",
            complemento: endereco.complemento || prev.complemento || prev.membroEnderecoDTO?.complemento || "",
        }));
    };

    const montarPayloadAlterado = () => {
        const payload = {};
        const enderecoOriginal = membro?.membroEnderecoDTO || {};
        const enderecoEdicao = {
            cep: dadosEdicao.cep ?? dadosEdicao.membroEnderecoDTO?.cep,
            bairro: dadosEdicao.bairro ?? dadosEdicao.membroEnderecoDTO?.bairro,
            cidade: dadosEdicao.cidade ?? dadosEdicao.membroEnderecoDTO?.cidade,
            rua: dadosEdicao.rua ?? dadosEdicao.membroEnderecoDTO?.rua,
            estado: dadosEdicao.estado ?? dadosEdicao.membroEnderecoDTO?.estado,
            numero: dadosEdicao.numero ?? dadosEdicao.membroEnderecoDTO?.numero,
            complemento: dadosEdicao.complemento ?? dadosEdicao.membroEnderecoDTO?.complemento,
        };

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
            const valorOriginal = membro?.[campo] ?? "";
            const valorAtual = dadosEdicao?.[campo] ?? "";
            if (String(valorOriginal ?? "") !== String(valorAtual ?? "")) {
                payload[campo] = valorAtual;
            }
        });

        const dataOriginal = normalizarDataNascimentoParaInput(membro?.dataNascimento);
        const dataAtual = normalizarDataNascimentoParaInput(dadosEdicao?.dataNascimento);
        if (dataOriginal !== dataAtual && dataAtual) {
            payload.dataNascimento = dataAtual;
        }

        const enderecoAlterado = Object.entries(enderecoEdicao).some(([campo, valorAtual]) => {
            const valorOriginal = enderecoOriginal?.[campo] ?? "";
            return String(valorOriginal ?? "") !== String(valorAtual ?? "");
        });

        if (enderecoAlterado) {
            payload.membroEnderecoDTO = enderecoEdicao;
        }

        return payload;
    };

    const handleSalvar = async () => {
        try {
            const payloadAlterado = montarPayloadAlterado();

            if (Object.keys(payloadAlterado).length === 0) {
                setEditando(false);
                return;
            }

            await atualizarPerfilLogado(payloadAlterado);

            let membroAtualizado;
            try {
                const perfilRecarregado = await buscarPerfilLogado();
                membroAtualizado = perfilRecarregado;
            } catch (reloadErr) {
                console.error("Erro ao recarregar perfil após salvar:", reloadErr);
                membroAtualizado = {
                    ...membro,
                    ...payloadAlterado,
                    membroEnderecoDTO: payloadAlterado.membroEnderecoDTO
                        ? { ...membro?.membroEnderecoDTO, ...payloadAlterado.membroEnderecoDTO }
                        : membro?.membroEnderecoDTO,
                };
            }

            setMembro(membroAtualizado);
            setDadosEdicao(membroAtualizado);
            setEditando(false);
            setFeedback({ tipo: "sucesso", mensagem: "Perfil atualizado com sucesso!" });
            setTimeout(() => setFeedback(null), 4000);
        } catch (err) {
            console.error(err);
            setFeedback({ tipo: "erro", mensagem: "Erro ao atualizar perfil." });
        }
    };

    const handleCancelar = () => {
        setDadosEdicao(membro);
        setEditando(false);
    };

    const campoDataNascimento = normalizarDataNascimentoParaInput(dadosEdicao?.dataNascimento);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-icf-primary-400"></div>
            </div>
        );
    }

    if (!membro) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-icf-primary-300">
                <User className="w-12 h-12 mb-4" />
                <p>Perfil não encontrado</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {feedback && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${feedback.tipo === "sucesso" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {feedback.mensagem}
                </div>
            )}
            {/* Card do Perfil */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Header do Perfil */}
                <div className="p-6 border-b border-icf-primary-50">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-icf-primary-100 flex items-center justify-center border-2 border-icf-primary-200">
                            <User className="w-8 h-8 text-icf-primary-400" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-icf-primary-400">
                                {membro.nome}
                            </h2>
                            <p className="text-icf-primary-300">
                                {formatarCargo(membro.cargo) || "Membro"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${membro.status === "ATIVO" ? "bg-green-500" : "bg-red-500"}`}></span>
                                <span className="text-sm text-icf-primary-300">
                                    {membro.status === "ATIVO" ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                        {editando ? (
                            // Modo de edição
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Contato</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputIcf
                                            label="Celular"
                                            value={dadosEdicao.celular || ""}
                                            onChange={(e) => handleChange("celular", e.target.value.replace(/\D/g, ''))}
                                        />
                                        <InputIcf
                                            label="Email"
                                            value={dadosEdicao.email || ""}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Data de Nascimento"
                                            type="date"
                                            value={campoDataNascimento}
                                            onChange={(e) => handleChange("dataNascimento", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Localidade</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputIcf
                                            label="CEP"
                                            value={dadosEdicao.cep ?? dadosEdicao.membroEnderecoDTO?.cep ?? ""}
                                            onChange={(e) => handleCepChange(e.target.value)}
                                        />
                                        <InputIcf
                                            label="Estado"
                                            value={dadosEdicao.estado ?? dadosEdicao.membroEnderecoDTO?.estado ?? ""}
                                            onChange={(e) => handleChange("estado", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Cidade"
                                            value={dadosEdicao.cidade ?? dadosEdicao.membroEnderecoDTO?.cidade ?? ""}
                                            onChange={(e) => handleChange("cidade", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Bairro"
                                            value={dadosEdicao.bairro ?? dadosEdicao.membroEnderecoDTO?.bairro ?? ""}
                                            onChange={(e) => handleChange("bairro", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Rua"
                                            value={dadosEdicao.rua ?? dadosEdicao.membroEnderecoDTO?.rua ?? ""}
                                            onChange={(e) => handleChange("rua", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Número"
                                            value={dadosEdicao.numero ?? dadosEdicao.membroEnderecoDTO?.numero ?? ""}
                                            onChange={(e) => handleChange("numero", e.target.value)}
                                        />
                                        <InputIcf
                                            label="Complemento"
                                            value={dadosEdicao.complemento ?? dadosEdicao.membroEnderecoDTO?.complemento ?? ""}
                                            onChange={(e) => handleChange("complemento", e.target.value)}
                                            className="md:col-span-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Modo de visualização
                            <div className="space-y-6">
                                {/* Contato */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Contato</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Celular</p>
                                            <p className="text-icf-primary-400">{formatarTelefone(membro.celular) || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Email</p>
                                            <p className="text-icf-primary-400">{membro.email || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Data de Nascimento</p>
                                            <p className="text-icf-primary-400">{safeFormatDate(membro.dataNascimento) || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Idade</p>
                                            <p className="text-icf-primary-400">{calcularIdade(membro.dataNascimento) || "-"} anos</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Localidade */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-icf-primary-400">Localidade</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">CEP</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.cep || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Estado</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.estado || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Cidade</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.cidade || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Bairro</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.bairro || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Rua</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.rua || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Número</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.numero || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-icf-primary-300 uppercase tracking-wide mb-1">Complemento</p>
                                            <p className="text-icf-primary-400">{membro.membroEnderecoDTO?.complemento || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer com botões */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-icf-primary-50">
                            {editando ? (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelar}
                                        className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSalvar}
                                        className="bg-icf-primary-400 hover:bg-icf-primary-300 text-white gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setEditando(true)}
                                    className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </Button>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
}