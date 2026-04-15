import { useState, useEffect } from "react";
import { buscarEscalas } from "../../../services/escalas";
import { buscarTodosMinisterios } from "../../../services/ministerios";
import { CardEscala } from "../../molecules/ICF/CardEscala";
import { formatarDataHora } from "../../../utils/Utils";
import { ModalVisualizarEvento } from "../../molecules/ICF/ModalVisualizarEvento";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { FilterBar } from "../../atoms/ICF/FilterBar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function Escalas() {
    const [fkMinisterio, setFkMinisterio] = useState("");
    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");

    const [escalas, setEscalas] = useState([]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const renderTitle = (date) =>
        date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    const [currentTitle, setCurrentTitle] = useState(renderTitle(currentDate));

    const carregarEscalas = async (mes, ano) => {
        const res = await buscarEscalas({ mes, ano, idMinisterio: fkMinisterio || null });
        setEscalas(res?.content || []);
    };

    useEffect(() => {
        carregarEscalas(currentDate.getMonth() + 1, currentDate.getFullYear());
    }, [fkMinisterio, currentDate]);

    const handlePrev = () => {
        const prev = new Date(currentDate);
        prev.setMonth(prev.getMonth() - 1);
        setCurrentDate(prev);
        setCurrentTitle(renderTitle(prev));
    };

    const handleNext = () => {
        const next = new Date(currentDate);
        next.setMonth(next.getMonth() + 1);
        setCurrentDate(next);
        setCurrentTitle(renderTitle(next));
    };

    // Listar os ministérios no select
    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarTodosMinisterios()
            .then((data) => setOptions(Array.isArray(data) ? data : data?.content || []))
            .catch((err) => {
                console.error("Erro ao buscar ministérios para filtro:", err);
                setOptions([]);
            });
    }, []);

    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const handleVerDetalhes = (escala) => {
        setEventoSelecionado({
            titulo: escala.nome,
            organizador: escala.organizador,
            publicoAlvo: escala.publicoAlvo,
            dataInicio: escala.dataHoraInicio,
            horaInicio: escala.horaInicio,
            horaFim: escala.horaFim,
            custo: escala.custo,
            local: escala.local,
            descricao: escala.descricao,
        }); 
    };
    const handleCloseModal = () => setEventoSelecionado(null);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <PageHeader
                titulo="Escalas"
                descricao="Gerencie todas as escalas dos ministérios"
            />

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Filters */}
                <div className="p-6 border-b border-icf-primary-50">
                    <FilterBar
                        searchPlaceholder="Buscar por nome do evento..."
                        searchValue={buscaTexto}
                        onSearchChange={setBuscaTexto}
                        showStatus={false}
                        selectOptions={options}
                        selectValue={fkMinisterio}
                        onSelectChange={setFkMinisterio}
                        selectPlaceholder="Todos os ministérios"
                    >
                        {/* Status Select customizado */}
                        <Select value={statusFiltro || "__all__"} onValueChange={(val) => setStatusFiltro(val === "__all__" ? "" : val)}>
                            <SelectTrigger className="w-[180px] bg-white border-icf-primary-100 h-10">
                                <SelectValue placeholder="Todas Escalas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Todas Escalas</SelectItem>
                                <SelectItem value="concluidas">Concluídas</SelectItem>
                                <SelectItem value="pendentes">Pendentes</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterBar>
                </div>

                {/* Navigation */}
                <div className="px-6 py-4 border-b border-icf-primary-50 flex items-center gap-4">
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-lg border border-icf-primary-100 hover:bg-icf-primary-50 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-icf-primary-300" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-lg border border-icf-primary-100 hover:bg-icf-primary-50 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-icf-primary-300" />
                    </button>
                    <span className="font-semibold text-lg text-icf-primary-400 capitalize">
                        {currentTitle}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6">
                    {escalas.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-icf-primary-200">
                            <Users className="w-12 h-12 mb-4" />
                            <p className="text-sm">Nenhuma escala encontrada para este mês</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {escalas.map((escala) => (
                                <CardEscala
                                    key={escala.idExterno}
                                    nomeEvento={escala.nome}
                                    status={"Pendente"}
                                    dataHoraInicio={formatarDataHora(escala.dataHoraInicio)}
                                    dataHoraFim={formatarDataHora(escala.dataHoraFim)}
                                    ministeriosConfirmados={escala.totalEventosMinisterioConfirmados}
                                    ministeriosEscalados={escala.totalEventoMinisterios}
                                    className={`${escala.status === "Pendente"
                                        ? "bg-warning-200"
                                        : escala.status === "Concluída"
                                            ? "bg-success-500"
                                            : "bg-icf-primary-200"
                                        } text-icf-primary-50 p-1 rounded-2xl text-sm`}
                                    onVerDetalhes={() => handleVerDetalhes(escala)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modal */}
            {eventoSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <ModalVisualizarEvento
                        evento={eventoSelecionado}
                        onClose={handleCloseModal}
                        onEdit={() => {}}
                    />
                </div>
            )}
        </div>
    );
}