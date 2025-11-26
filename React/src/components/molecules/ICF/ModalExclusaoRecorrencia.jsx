import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { FiX } from "react-icons/fi";

export function ModalExclusaoRecorrencia({
    titulo,
    pergunta,
    onClose,
    onConfirm,
    opcaoRecorrencia,
    setOpcaoRecorrencia
}) {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-bold text-2xl">Confirmar Exclusão</span>
                        <span className="text-icf-primary-200 text-sm">Tem certeza que deseja excluir o evento <span>"Culto de oração"?</span></span>
                    </div>
                    <button className="text-xl hover:text-white hover:bg-icf-primary-400 rounded">
                        <FiX></FiX>
                    </button>
                </div>
                <div className="border border-icf-primary-50"></div>
                <div className="flex flex-col gap-1">

                    <span>Escolha uma opção</span>
                    <div className="flex flex-col items-start gap-2">
                        <label className="flex items-center border rounded p-3 gap-3 w-full cursor-pointer border-icf-primary-200 bg-surface-50 hover:bg-icf-primary-50">
                            <input type="radio" name="excluirRecorrencia" checked={opcaoRecorrencia === "unico"} onChange={ () => setOpcaoRecorrencia("unico")} className="appearance-none w-3 h-3 rounded-full border-2 border-icf-primary-300 checked:bg-icf-primary-400 transition-colors" />
                            <div className="flex flex-col">
                                <span className="text-icf-primary-400">Excluir apenas este evento</span>
                                <span className="text-sm text-icf-primary-200">Remove somente esta ocorrência</span>
                            </div>
                        </label>
                        <label className="flex items-center border rounded p-3 gap-3 w-full cursor-pointer border-icf-primary-200 bg-surface-50 hover:bg-icf-primary-50">
                            <input type="radio" name="excluirRecorrencia" checked={opcaoRecorrencia === "multiplos"} onChange={() => setOpcaoRecorrencia("multiplos")} className="appearance-none w-3 h-3 rounded-full border-2 border-icf-primary-300 checked:bg-icf-primary-400 transition-colors" />
                            <div className="flex flex-col">
                                <span className="text-icf-primary-400">Excluir este e todas as recorrências</span>
                                <span className="text-sm text-icf-primary-200">Remove este evento e todos os futuros</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-center gap-6">
                        <div className="w-[75%] flex gap-4">
                            <BotaoIcf className="bg-icf-primary-400">Excluir</BotaoIcf>
                            <BotaoIcf className="bg-icf-primary-200">Cancelar</BotaoIcf>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}