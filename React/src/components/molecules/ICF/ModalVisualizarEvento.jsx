import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { InfoEvento } from "../../atoms/ICF/InfoEvento";

export function ModalVisualizarEvento() {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Culto de jovens"} />
                <div className="border border-icf-primary-50"></div>
                <InfoEvento label={"Organizador"} info={"Samuel Nicolau"} />
                <InfoEvento label={"Nome do evento"} info={"Culto de Jovens"} />
                <InfoEvento label={"Público-alvo"} info={"Jovens"} />
                <InfoEvento label={"Escala"} info={"Louvor, Mídia, Dança"} />
                <div className="flex justify-between">
                    <InfoEvento label={"Data"} info={"02/10/2025"} />
                    <InfoEvento label={"Início"} info={"18:00"} />
                    <InfoEvento label={"Fim"} info={"22:30"} />
                </div>
                <span className="text-icf-primary-200">Ocorre a cada Sábado até 04 de Abril de 2026</span>
                <div className="flex justify-between">
                    <InfoEvento label={"Valor do ingresso"} info={"Gratuito"} />
                    <InfoEvento label={"Local"} info={"Unidade ICF Ponte Rasa"} />
                </div>
                <InfoEvento label={"Descrição"} info={"Encontro semanal da juventude com louvor, palavra e comunhão."} />
                <div className="flex justify-end">
                    <div className="w-[30%]">
                        <BotaoIcf className="bg-icf-primary-400 flex items-center justify-center gap-2">Editar</BotaoIcf>
                    </div>
                </div>
            </div>
        </div>
    )
}