import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { InfoEvento } from "../../atoms/ICF/InfoEvento";

export function ModalVisualizarEvento({ evento, onClose, onEdit }) {
    if (!evento) return null;

    const cargo = localStorage.getItem("cargo");
    const podeEditar = cargo === "LIDER_MINISTERIO" || cargo === "GOVERNO";

    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={evento.titulo} onClose={onClose} />
                <div className="border border-icf-primary-50"></div>
                <InfoEvento label={"Organizador"} info={evento.organizador} />
                <InfoEvento label={"Nome do evento"} info={evento.titulo} />
                <InfoEvento label={"Público-alvo"} info={evento.publicoAlvo} />
                {/* <InfoEvento label={"Escala"} info={"Louvor, Mídia, Dança"} /> */}
                <div className="flex justify-between">
                    <InfoEvento label={"Data"} info={new Date(evento.dataInicio).toLocaleDateString('pt-BR')} />
                    <InfoEvento label={"Início"} info={evento.horaInicio || "00:00"} />
                    <InfoEvento label={"Fim"} info={evento.horaFim || "00:00"} />
                </div>
                {/* <span className="text-icf-primary-200">Ocorre a cada Sábado até 04 de Abril de 2026</span> */}
                <div className="flex justify-between">
                    <InfoEvento label={"Valor do ingresso"} info={evento.custo == 0 ? "Gratuito" : "R$ " + evento.custo} />
                    <InfoEvento label={"Local"} info={evento.local || "-"} />
                </div>
                <InfoEvento label={"Descrição"} info={evento.descricao || "Sem descrição"}
                />
                {podeEditar && (
                    <div className="flex justify-end">
                        <div className="w-[30%]">
                            <BotaoIcf
                                onClick={onEdit}
                                className="bg-icf-primary-400 flex items-center justify-center gap-2">
                                Editar
                            </BotaoIcf>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}