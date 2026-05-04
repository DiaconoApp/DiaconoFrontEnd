import { useEffect, useState } from "react";
import { Users, UserPlus, Church } from "lucide-react";
import { LinhaMinisterioMembro } from "../../molecules/ICF/LinhaMinisterioMembro";
import { ModalMembroMinisterio } from "../../molecules/ICF/ModalMembroMinisterio";
import { buscarMembrosMinisterios, buscarMinisteriosQueLidero } from "../../../services/ministerios";
import { formatarCargo, formatarTelefone, safeFormatDate, transformationName } from "../../../utils/Utils";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { FilterBar } from "../../atoms/ICF/FilterBar";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ListaMinisterioLider() {
    const [modalAberto, setModalAberto] = useState(false);
    const [membros, setMembros] = useState([]);
    const [ministerios, setMinisterios] = useState([]);
    const [ministerioSelecionado, setMinisterioSelecionado] = useState(null);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tamanhoPagina] = useState(10);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");

    // Carregar ministérios que o líder lidera
    useEffect(() => {
        buscarMinisteriosQueLidero({})
            .then((res) => {
                const lista = res || [];
                setMinisterios(lista);
                if (lista.length > 0) {
                    setMinisterioSelecionado(lista[0]);
                }
            });
    }, []);

    // Carregar membros do ministério selecionado
    const carregarMembros = () => {
        if (!ministerioSelecionado?.idExterno) return;

        const filtros = {
            pagina: paginaAtual,
            tamanho: tamanhoPagina,
            busca: buscaTexto,
            idMinisterio: ministerioSelecionado.idExterno,
        };

        buscarMembrosMinisterios(filtros)
            .then((res) => {
                setMembros(res.content || []);
                setTotalPaginas(res.totalPages || 1);
            })
            .catch((err) => {
                console.error("Erro ao buscar membros do ministério:", err);
                setMembros([]);
                setTotalPaginas(1);
            });
    };

    useEffect(() => {
        carregarMembros();
    }, [paginaAtual, buscaTexto, statusSelecionado, tamanhoPagina, ministerioSelecionado]);

    const handleMinisterioChange = (idExterno) => {
        const ministerio = ministerios.find(m => m.idExterno === idExterno);
        setMinisterioSelecionado(ministerio);
        setPaginaAtual(0);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <PageHeader
                titulo="Meu Ministério"
                descricao="Gerencie os membros do seu ministério"
            >
                <Button
                    onClick={() => setModalAberto(true)}
                    className="bg-icf-primary-400 hover:bg-icf-primary-300 text-white gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Adicionar Membro
                </Button>
            </PageHeader>

            {/* Seletor de Ministério (se líder de mais de um) */}
            {ministerios.length > 1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <Church className="w-5 h-5 text-icf-primary-400" />
                        <span className="text-sm font-medium text-icf-primary-400">Ministério:</span>
                        <Select 
                            value={ministerioSelecionado?.idExterno || ""} 
                            onValueChange={handleMinisterioChange}
                        >
                            <SelectTrigger className="w-[300px] bg-white border-icf-primary-200">
                                <SelectValue placeholder="Selecione um ministério" />
                            </SelectTrigger>
                            <SelectContent>
                                {ministerios.map((min) => (
                                    <SelectItem key={min.idExterno} value={min.idExterno}>
                                        {min.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Info Card do Ministério */}
            {ministerioSelecionado && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-icf-primary-100 flex items-center justify-center">
                                <Church className="w-6 h-6 text-icf-primary-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-icf-primary-400">{ministerioSelecionado.nome}</h3>
                                <p className="text-sm text-icf-primary-300">
                                    {membros.length} {membros.length === 1 ? 'membro' : 'membros'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Filters */}
                <div className="p-6 border-b border-icf-primary-50">
                    <FilterBar
                        searchPlaceholder="Buscar por nome do membro..."
                        searchValue={buscaTexto}
                        onSearchChange={(val) => { setPaginaAtual(0); setBuscaTexto(val); }}
                        statusValue={statusSelecionado}
                        onStatusChange={(val) => { setPaginaAtual(0); setStatusSelecionado(val); }}
                    />
                </div>

                {/* Table */}
                <div className="p-6">
                    <ul className="flex flex-col gap-1 w-full">
                        <li className="grid grid-cols-5 bg-icf-primary-100 text-icf-primary-400 font-bold p-4 rounded-t-lg">
                            {["Nome", "Email", "Celular", "Data Nascimento", "Cargo"].map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </li>

                        {membros.length === 0 ? (
                            <li className="py-12 flex flex-col items-center justify-center text-icf-primary-200 bg-icf-primary-50">
                                <Users className="w-12 h-12 mb-4" />
                                <p className="text-sm">Nenhum membro encontrado</p>
                            </li>
                        ) : (
                            membros.map((m) => (
                                <LinhaMinisterioMembro
                                    key={m.idExternoMembro}
                                    idMembro={m.idExternoMembro}
                                    idMinisterio={ministerioSelecionado?.idExterno}
                                    nome={transformationName(m.nome)}
                                    email={m.email?.trim().toLowerCase()}
                                    celular={formatarTelefone(m.numeroCelular)}
                                    cargo={formatarCargo(m.cargo)}
                                    dtNascimento={safeFormatDate(m.dataNascimento)}
                                    onRemovido={carregarMembros}
                                />
                            ))
                        )}
                    </ul>
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                    <div className="px-6 py-4 border-t border-icf-primary-50 flex items-center justify-center gap-4">
                        {paginaAtual > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setPaginaAtual((prev) => prev - 1)}
                                className="border-icf-primary-200 text-icf-primary-400"
                            >
                                Anterior
                            </Button>
                        )}
                        <span className="text-sm text-icf-primary-400">
                            Página {paginaAtual + 1} de {totalPaginas}
                        </span>
                        {paginaAtual < totalPaginas - 1 && (
                            <Button
                                variant="outline"
                                onClick={() => setPaginaAtual((prev) => prev + 1)}
                                className="border-icf-primary-200 text-icf-primary-400"
                            >
                                Próxima
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalAberto && ministerioSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <ModalMembroMinisterio
                        onCancelar={() => setModalAberto(false)}
                        fkMinisterio={ministerioSelecionado.idExterno}
                        onMembroAdicionado={carregarMembros}
                    />
                </div>
            )}
        </div>
    );
}
