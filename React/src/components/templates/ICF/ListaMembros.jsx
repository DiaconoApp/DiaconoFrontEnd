import { useEffect, useState } from "react";
import { ExternalLink, Users, Mail, Phone } from "lucide-react";
import { buscarMinisterios } from "../../../services/ministerios";
import { transformationName, formatarTelefone } from "../../../utils/Utils";
import { FormMembro } from "../../molecules/ICF/FormMembro";
import { FormEditarMembro } from "../../molecules/ICF/FormEditarMembro";
import { buscarMembros } from "../../../services/membros";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { FilterBar } from "../../atoms/ICF/FilterBar";
import { StatusBadge } from "../../atoms/ICF/DataTable";

// Helper para formatar cargo
const formatarCargo = (cargo) => {
    const cargos = {
        "MEMBRO": "Membro",
        "LIDER_MINISTERIO": "Líder",
        "GOVERNO": "Governo",
    };
    return cargos[cargo] || cargo || "-";
};

export function ListaMembros() {
    const [abrirForm, setAbrirForm] = useState(false);
    const [membroEditando, setMembroEditando] = useState(null);
    const [membros, setMembros] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tamanhoPagina] = useState(10);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");
    const [fkMinisterio, setFkMinisterio] = useState("");

    const adaptarStatus = (status) => {
        const s = status.trim().toLowerCase();
        if (s === "ativos") return "ATIVO";
        if (s === "inativos") return "INATIVO";
        return "";
    };

    const montarFiltros = () => {
        const filtros = {
            pagina: paginaAtual,
            tamanho: tamanhoPagina,
            busca: buscaTexto,
            fkMinisterio,
        };
        const statusFormatado = adaptarStatus(statusSelecionado);
        if (statusFormatado) filtros.status = statusFormatado;
        return filtros;
    };

    const carregarMembros = () => {
        buscarMembros(montarFiltros())
            .then((res) => {
                setMembros(res.content || []);
                setTotalPaginas(res.totalPages || 1);
            })
            .catch((err) => {
                console.error("Erro ao buscar membros:", err);
                setMembros([]);
                setTotalPaginas(1);
            });
    };

    useEffect(() => {
        carregarMembros();
    }, [paginaAtual, buscaTexto, statusSelecionado, tamanhoPagina, fkMinisterio]);

    // Listar os ministérios no select
    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarMinisterios({})
            .then((res) => setOptions(res.content || []));
    }, []);

    // Tela de cadastro
    if (abrirForm) {
        return (
            <div className="flex flex-col gap-6">
                <FormMembro fecharFormulario={() => { setAbrirForm(false); carregarMembros(); }} />
            </div>
        );
    }

    // Tela de edição
    if (membroEditando) {
        return (
            <div className="flex flex-col gap-6">
                <FormEditarMembro 
                    idMembro={membroEditando} 
                    fecharFormulario={() => { setMembroEditando(null); carregarMembros(); }} 
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <PageHeader
                titulo="Membros"
                descricao="Gerencie todos os membros da igreja"
                textoBotao="Novo Membro"
                acaoPrimaria={() => setAbrirForm(true)}
            />

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Filters */}
                <div className="p-6 border-b border-icf-primary-50">
                    <FilterBar
                        searchPlaceholder="Buscar por nome, telefone ou email..."
                        searchValue={buscaTexto}
                        onSearchChange={(val) => { setPaginaAtual(0); setBuscaTexto(val); }}
                        statusValue={statusSelecionado}
                        onStatusChange={(val) => { setPaginaAtual(0); setStatusSelecionado(val); }}
                        selectOptions={options}
                        selectValue={fkMinisterio}
                        onSelectChange={(val) => { setPaginaAtual(0); setFkMinisterio(val); }}
                        selectPlaceholder="Todos..."
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-icf-primary-50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Celular
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Cargo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Ministério
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-icf-primary-50">
                            {membros.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-icf-primary-200" />
                                        <p className="text-sm text-icf-primary-300">Nenhum membro encontrado</p>
                                    </td>
                                </tr>
                            ) : (
                                membros.map((membro) => (
                                    <tr key={membro.idExterno} className="hover:bg-icf-primary-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-icf-primary-400">
                                            {transformationName(membro.nome)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-icf-primary-300">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-icf-primary-200" />
                                                {membro.email?.toLowerCase() || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-icf-primary-300">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-icf-primary-200" />
                                                {formatarTelefone(membro.celular) || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-icf-primary-300">
                                            {formatarCargo(membro.cargo)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {membro.ministerios && membro.ministerios.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {membro.ministerios.map((ministerio, index) => (
                                                        <span
                                                            key={ministerio.idExterno || ministerio.nomeMinisterio || index}
                                                            className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-icf-primary-100 text-icf-primary-400"
                                                        >
                                                            {transformationName(ministerio.nomeMinisterio)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-icf-primary-200">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={membro.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => setMembroEditando(membro.idExterno)}
                                                className="text-icf-primary-200 hover:text-icf-primary-400 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPaginas > 1 && (
                    <div className="px-6 py-4 border-t border-icf-primary-50 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setPaginaAtual((prev) => prev - 1)}
                            disabled={paginaAtual === 0}
                            className="px-4 py-2 text-sm font-medium text-icf-primary-400 bg-icf-primary-50 rounded-lg hover:bg-icf-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-icf-primary-300">
                            Página {paginaAtual + 1} de {totalPaginas}
                        </span>
                        <button
                            onClick={() => setPaginaAtual((prev) => prev + 1)}
                            disabled={paginaAtual >= totalPaginas - 1}
                            className="px-4 py-2 text-sm font-medium text-icf-primary-400 bg-icf-primary-50 rounded-lg hover:bg-icf-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}