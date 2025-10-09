import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { EnderecosSalvos } from "../../atoms/ICF/EnderecosSalvos";

export function ModalLocal2() {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Endereços Salvos"} />
                <div className="border border-icf-primary-50"></div>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-35">
                    <EnderecosSalvos titulo={"Igreja ICF"} endereco={"Rua estonia, 1469"}/>
                </div>
                <div className="w-full flex justify-between gap-25">
                    <BotaoIcf className="bg-icf-primary-400 flex items-center justify-center gap-2"><span className="text-xl mb-1">+</span> Novo Endereço</BotaoIcf>
                    <BotaoIcf className="bg-icf-primary-200">Fechar</BotaoIcf>
                </div>
            </div>
        </div>
    );
}