import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";

export function ModalExclusao({ titulo, pergunta, onConfirm, onCancel }) {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={titulo} onClose={onCancel} />
                <div className="border border-icf-primary-50"></div>
                <div className="flex justify-center">
                    <label className="w-[50%]">{pergunta}</label>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center gap-6">
                        <div className="w-[75%] flex gap-4">
                            <BotaoIcf className="bg-icf-primary-400" onClick={onConfirm}>Sim</BotaoIcf>
                            <BotaoIcf className="bg-icf-primary-200" onClick={onCancel}>Não</BotaoIcf>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}