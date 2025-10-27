import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"

export function EscalaResumo() {
    return (
        <div className="w-[25%] border border-icf-primary-200 p-6 rounded-lg flex flex-col gap-1">
            <div className="flex justify-between">
                <h3 className="text-xl font-semibold text-icf-primary-400 tracking-default">Reunião</h3>
                <div className="flex items-center rounded-2xl bg-warning-200 text-icf-primary-50 px-2 font-semibold text-[9px]">
                    <span>Pendente</span>
                </div>
            </div>
            <span className="text-sm text-icf-primary-200 tracking-default font-normal">11/09 - Quinta</span>
            <span className="text-sm text-icf-primary-200 tracking-default font-normal">19:00 - 21:00</span>
            <span className="text-sm text-icf-primary-200 tracking-default font-normal">0/7 ministerios confirmados</span>
            <div className="flex gap-3.5 mt-1.5">
            <BotaoIcf className="bg-icf-primary-400 flex text-xs font-medium items-center justify-center" onClick={() => navigate('')}>Ver detalhes</BotaoIcf>
            <BotaoIcf className="bg-icf-primary-200 flex text-xs font-medium items-center justify-center" onClick={() => navigate('')}>Ver detalhes</BotaoIcf>
            </div>
        </div>
    )
}