import { useState, useEffect } from "react";
import { buscarEscalas, buscarEscalasGoverno } from "../../../services/escalas";
import { buscarTodosMinisterios, buscarMinisteriosQueLidero } from "../../../services/ministerios";
import { CardEscala } from "../../molecules/ICF/CardEscala";
import { ModalEscalarMinisterios } from "../../molecules/ICF/ModalEscalarMinisterios";
import { formatarDataHora } from "../../../utils/Utils";
import { ModalVisualizarEvento } from "../../molecules/ICF/ModalVisualizarEvento";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { FilterBar } from "../../atoms/ICF/FilterBar";
import { StatusToggle } from "../../atoms/ICF/StatusToggle";

export function Escalas() {
    const cargo = localStorage.getItem("cargo");
    console.log("Cargo do usuário:", cargo);
    const isGoverno = cargo === "GOVERNO";
    console.log("isGoverno:", isGoverno);
    const isLider = cargo === "LIDER_MINISTERIO";

    const [fkMinisterio, setFkMinisterio] = useState("");
    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("todos");

    const [escalas, setEscalas] = useState([]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const renderTitle = (date) =>
        date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    const [currentTitle, setCurrentTitle] = useState(renderTitle(currentDate));

    const carregarEscalas = async (mes, ano) => {
        try {
            let escalasData = [];

            if (isGoverno) {
                // Visão Governo: usar novo endpoint
                escalasData = await buscarEscalasGoverno({
                    mes,
                    ano,
                    status: statusFiltro === "todos" ? "" : statusFiltro.toUpperCase(),
                    ministerioId: fkMinisterio,
                    nomeEvento: buscaTexto
                });
                // API retorna array diretamente
                setEscalas(Array.isArray(escalasData) ? escalasData : []);
            } else {
                // Visão Lider e Membro: usar endpoint antigo
                const res = await buscarEscalas({ mes, ano, idMinisterio: fkMinisterio || null });
                setEscalas(res?.content || []);
            }
        } catch (err) {
            console.error("Erro ao carregar escalas:", err);
            setEscalas([]);
        }
    };

    useEffect(() => {
        carregarEscalas(currentDate.getMonth() + 1, currentDate.getFullYear());
    }, [fkMinisterio, currentDate, statusFiltro, buscaTexto, cargo]);

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

    // Carrega os ministérios de acordo com o cargo
    const [options, setOptions] = useState([]);
    useEffect(() => {
        const carregarMinisterios = async () => {
            try {
                if (isGoverno) {
                    // Visão Governo: todos os ministérios
                    const data = await buscarTodosMinisterios();
                    setOptions(Array.isArray(data) ? data : data?.content || []);
                } else if (isLider) {
                    // Visão Lider: ministérios que ele lidera
                    const data = await buscarMinisteriosQueLidero();
                    setOptions(Array.isArray(data) ? data : data?.content || []);
                } else {
                    // Visão Membro: nenhum filtro de ministério necessário
                    setOptions([]);
                }
            } catch (err) {
                console.error("Erro ao buscar ministérios para filtro:", err);
                setOptions([]);
            }
        };

        carregarMinisterios();
    }, [cargo]);

    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [eventoGerenciando, setEventoGerenciando] = useState(null);

    // Função para mapear dados do novo formato (visão governo)
    const mapearEscalaGoverno = (escala) => {
        // O payload do novo endpoint é diferente, então precisamos mapear corretamente
        return {
            idExterno: escala.idExternoEvento,
            nome: escala.nomeReuniao,
            dataHoraInicio: escala.dataHoraInicio,
            dataHoraFim: escala.dataHoraFim,
            totalEventoMinisterios: escala.ministeriosEscalados || 0,
            totalEventosMinisterioConfirmados: escala.ministeriosEscaladosConfirmados || 0,
            status: escala.status
        };
    };

    const handleVerDetalhes = (escala) => {
        setEventoSelecionado({
            titulo: escala.nome || escala.nomeReuniao,
            organizador: escala.organizador || "N/A",
            publicoAlvo: escala.publicoAlvo || "N/A",
            dataInicio: escala.dataHoraInicio,
            horaInicio: escala.horaInicio,
            horaFim: escala.horaFim,
            custo: escala.custo || "N/A",
            local: escala.local || "N/A",
            descricao: escala.descricao || "N/A",
        }); 
    };

    const handleGerenciarMinisterios = (escala) => {
        console.log("handleGerenciarMinisterios chamado com escala:", escala);
        console.log("idExterno:", escala.idExterno);
        setEventoGerenciando({
            idExterno: escala.idExterno,
            nome: escala.nome || escala.nomeReuniao,
        });
        console.log("eventoGerenciando setado:", { idExterno: escala.idExterno, nome: escala.nome || escala.nomeReuniao });
    };
    
    const handleCloseModal = () => setEventoSelecionado(null);
    const handleCloseGerenciarMinisterios = () => setEventoGerenciando(null);

    // Mapeia escalas para o formato esperado
    const escalasMapeadas = escalas.map(escala => 
        isGoverno ? mapearEscalaGoverno(escala) : escala
    );

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
                        selectPlaceholder={isGoverno ? "Todos os ministérios" : "Ministérios"}
                    >
                        {/* Status Toggle Buttons - apenas para visão Governo */}
                        {isGoverno && (
                            <StatusToggle
                                value={statusFiltro}
                                onChange={setStatusFiltro}
                                options={[
                                    { value: "todos", label: "Todos" },
                                    { value: "pendente", label: "Pendentes" },
                                    { value: "confirmado", label: "Confirmados" },
                                    { value: "concluido", label: "Concluídos" },
                                ]}
                            />
                        )}
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
                    {escalasMapeadas.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-icf-primary-200">
                            <Users className="w-12 h-12 mb-4" />
                            <p className="text-sm">Nenhuma escala encontrada para este mês</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {escalasMapeadas.map((escala) => (
                                <CardEscala
                                    key={escala.idExterno}
                                    nomeEvento={escala.nome || escala.nomeReuniao}
                                    status={isGoverno ? escala.status : "Pendente"}
                                    dataHoraInicio={formatarDataHora(escala.dataHoraInicio)}
                                    dataHoraFim={formatarDataHora(escala.dataHoraFim)}
                                    ministeriosConfirmados={escala.totalEventosMinisterioConfirmados}
                                    ministeriosEscalados={escala.totalEventoMinisterios}
                                    onVerDetalhes={() => handleVerDetalhes(escala)}
                                    onGerenciarMinisterios={isGoverno ? () => handleGerenciarMinisterios(escala) : undefined}
                                    eventoId={escala.idExterno}
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

            {/* Modal Escalar Ministérios */}
            {eventoGerenciando && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <ModalEscalarMinisterios
                        eventoId={eventoGerenciando.idExterno}
                        onClose={handleCloseGerenciarMinisterios}
                        onConfirm={() => {
                            // Recarregar escalas após confirmar
                            carregarEscalas(currentDate.getMonth() + 1, currentDate.getFullYear());
                        }}
                    />
                </div>
            )}
        </div>
    );
}