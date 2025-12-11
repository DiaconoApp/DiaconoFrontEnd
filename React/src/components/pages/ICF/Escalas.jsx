import { Menu } from "../../templates/ICF/Menu";
import { useState, useEffect } from "react";
import { TituloPagina } from "../../atoms/ICF/TituloPagina";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { buscarMinisterios } from "../../../services/ministerios";
import { buscarEscalas } from "../../../services/escalas";
import { CardEscala } from "../../molecules/ICF/CardEscala";
import { formatarDataHora } from "../../../utils/Utils";
import { ModalVisualizarEvento } from "../../molecules/ICF/ModalVisualizarEvento";
import api from "../../../provider/api";

export function Escalas() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    const [fkMinisterio, setFkMinisterio] = useState("");

    const [escalas, setEscalas] = useState([]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const renderTitle = (date) =>
        date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    const [currentTitle, setCurrentTitle] = useState(renderTitle(currentDate));

    const carregarEscalas = async (mes, ano) => {
        const res = await buscarEscalas({ mes, ano, idMinisterio: fkMinisterio });
        setEscalas(res?.content || []);
    };

    useEffect(() => {
        carregarEscalas(currentDate.getMonth() + 1, currentDate.getFullYear());
    }, []);

    const handleToday = () => {
        const hoje = new Date();
        setCurrentDate(hoje);
        setCurrentTitle(renderTitle(hoje));
        carregarEscalas(hoje.getMonth() + 1, hoje.getFullYear());
    };

    const handlePrev = () => {
        const prev = new Date(currentDate);
        prev.setMonth(prev.getMonth() - 1);
        setCurrentDate(prev);
        setCurrentTitle(renderTitle(prev));
        carregarEscalas(prev.getMonth() + 1, prev.getFullYear());
    };

    const handleNext = () => {
        const next = new Date(currentDate);
        next.setMonth(next.getMonth() + 1);
        setCurrentDate(next);
        setCurrentTitle(renderTitle(next));
        carregarEscalas(next.getMonth() + 1, next.getFullYear());
    };

    // Listar os ministérios no select
    const [options, setOptions] = useState([]);
    useEffect(() => {
        api.get('/api/v1/ministerios/lider-ministerio')
            .then((res) => setOptions(res.content || []));
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
    const handleEditEvento = () => {
        console.log("Editar evento:", eventoSelecionado);
    };

    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300
            ${espacamento}`}>
                <TituloPagina titulo="Escalas" descricao="Gerencie todas as escalas dos ministérios" />
            </div>
            <div className={`${espacamento} px-6`}>
                <div className="bg-white p-4 flex flex-col gap-5">

                    {/* ---------- BARRA SUPERIOR ---------- */}
                    <div className="flex items-center justify-between mb-2.5">
                        {/* Navegação e título */}
                        <div className="flex items-center gap-5 ml-2">
                            <button
                                onClick={handleToday}
                                className="px-3 py-1 rounded text-sm text-icf-primary-300 hover:bg-icf-primary-100"
                            >
                                Hoje
                            </button>

                            <button onClick={handlePrev} className="px-2 py-1 rounded w-6 h-6">
                                <img src="/seta.png" alt="Anterior" />
                            </button>

                            <button
                                onClick={handleNext}
                                className="px-2 py-1 rounded rotate-180 w-6 h-6"
                            >
                                <img src="/seta.png" alt="Próximo" />
                            </button>

                            <div className="ml-5 font-bold text-2xl text-icf-primary-300 capitalize">
                                {currentTitle}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="w-[33%]">
                            <InputBuscar placeholder="Buscar por nome do evento" />
                        </div>
                        <div className="w-[33%]">
                            <select className="text-icf-primary-400 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 p-4 focus:border-icf-primary-200 focus:border-3 w-full text-[14px]">
                                <option value="">Todos os status</option>
                                <option value="concluidas">Concluídas</option>
                                <option value="pendentes">Pendentes</option>
                            </select>
                        </div>
                        <div className="w-[33%]">
                            <SelectIcf
                                opt1={<option value="">Todos os ministérios</option>}
                                options={options}
                                value={fkMinisterio}
                                onChange={(val) => setFkMinisterio(val)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between flex-wrap gap-5">
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
                                    ? "bg-[#F2AB53]"
                                    : escala.status === "Concluída"
                                        ? "bg-[#1ABD8C]"
                                        : "bg-gray-300"
                                    } text-icf-primary-50 p-1 rounded-2xl text-sm`}
                                onVerDetalhes={() => handleVerDetalhes(escala)}

                            />
                        ))}
                    </div>
                </div>
            </div>
            {eventoSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
                    <ModalVisualizarEvento
                        evento={eventoSelecionado}
                        onClose={handleCloseModal}
                        onEdit={handleEditEvento}
                    />
                </div>
            )}
        </div>
    );
}