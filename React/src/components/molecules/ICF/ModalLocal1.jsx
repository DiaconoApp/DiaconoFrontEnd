import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { InputIcf } from "../../atoms/ICF/InputIcf";

export function ModalLocal1() {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Local do Evento"} />
                <div className="border border-icf-primary-50"></div>
                <InputIcf label={"CEP"} placeholder={"Digite seu CEP"} />
                <InputIcf label={"Rua/Avenida"} placeholder={"Ex: Rua Japão"} />
                <div className="flex gap-8">
                    <InputIcf label={"Cidade"} placeholder={"Digite sua cidade"} />
                    <InputIcf label={"Bairro"} placeholder={"Digite seu bairro"} />
                </div>
                <div className="flex gap-8">
                    <InputIcf label={"Número"} placeholder={"Digite o número"} />
                    <InputIcf label={"Complemento"} placeholder={"Digite o complemento"} />
                </div>
                <InputIcf label={"Apelido do Endereço"} placeholder={"Ex: Igreja ICF"} />
                <div className="flex gap-2">
                    <input type="checkbox" className="accent-icf-primary-400" />
                    <label className="text-icf">Favoritar Endereço</label>
                </div>
                <div className="w-full flex justify-end gap-4">
                    <div className="w-[60%] flex gap-5">
                        <BotaoIcf className="bg-icf-primary-400">Salvar</BotaoIcf>
                        <BotaoIcf className="bg-icf-primary-200">Cancelar</BotaoIcf>
                    </div>
                </div>
            </div>
        </div>
    );
}