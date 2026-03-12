import { useEffect, useState } from "react";
import { ExternalLink, Church } from "lucide-react";
import { ModalMinisterio } from "../../molecules/ICF/ModalMinisterio";
import { buscarMinisterios } from "../../../services/ministerios";
import { safeFormatDate, transformationName } from "../../../utils/Utils";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { FilterBar } from "../../atoms/ICF/FilterBar";
import { StatusBadge } from "../../atoms/ICF/DataTable";

export function ListaMinisterios() {
    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [ministerioSelecionado, setMinisterioSelecionado] = useState(null);

    const [ministerios, setMinisterios] = useState([]);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tamanhoPagina] = useState(10);

    const abrirModalCriar = () => {
        setModoEdicao(false);
        setModalAberto(true);
    };

    const abrirModalEditar = (ministerio) => {
        setModoEdicao(true);
        setMinisterioSelecionado(ministerio);
        setModalAberto(true);
    };

    const adaptarStatus = (status) => {
        const s = status.trim().toLowerCase();
        if (s === "ativo" || s === "ativos") return "ATIVO";
        if (s === "inativo" || s === "inativos") return "INATIVO";
        return "";
    };

    const montarFiltros = () => {
        const filtros = {
            pagina: paginaAtual,
            tamanho: tamanhoPagina,
            busca: buscaTexto,
        };
        const statusFormatado = adaptarStatus(statusSelecionado);
        if (statusFormatado) filtros.status = statusFormatado;
        return filtros;
    };

    const carregarMinisterios = () => {
        buscarMinisterios(montarFiltros())
            .then((res) => {
                setMinisterios(res.content || []);
                setTotalPaginas(res.totalPages || 1);
            })
            .catch((err) => {
                console.error("Erro ao buscar ministerios:", err);
                setMinisterios([]);
                setTotalPaginas(1);
            });
    };

    useEffect(() => {
        carregarMinisterios();
    }, [paginaAtual, buscaTexto, statusSelecionado, tamanhoPagina]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <PageHeader
                titulo="Ministérios"
                descricao="Gerencie todos os ministérios da igreja"
                textoBotao="Novo Ministério"
                acaoPrimaria={abrirModalCriar}
            />

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Filters */}
                <div className="p-6 border-b border-icf-primary-50">
                    <FilterBar
                        searchPlaceholder="Buscar por nome do ministério..."
                        searchValue={buscaTexto}
                        onSearchChange={(val) => { setPaginaAtual(0); setBuscaTexto(val); }}
                        statusValue={statusSelecionado}
                        onStatusChange={(val) => { setPaginaAtual(0); setStatusSelecionado(val); }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-icf-primary-50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Nome do Ministério
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Líder
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider">
                                    Data de Criação
                                </th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-icf-primary-50">
                            {ministerios.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Church className="w-12 h-12 mx-auto mb-4 text-icf-primary-200" />
                                        <p className="text-sm text-icf-primary-300">Nenhum ministério encontrado</p>
                                    </td>
                                </tr>
                            ) : (
                                ministerios.map((m) => (
                                    <tr key={m.idExterno} className="hover:bg-icf-primary-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-icf-primary-400">
                                            {transformationName(m.nome)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-icf-primary-300">
                                            {transformationName(m.nomeLider)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={m.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-icf-primary-300">
                                            {safeFormatDate(m.dataCriacao)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => abrirModalEditar(m)}
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

            {/* Modal */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <ModalMinisterio
                        tipo={modoEdicao ? "editar" : "criar"}
                        ministerio={ministerioSelecionado}
                        onSalvar={() => {
                            carregarMinisterios();
                            setModalAberto(false);
                        }}
                        onCancelar={() => setModalAberto(false)}
                    />
                </div>
            )}
        </div>
    );
}
