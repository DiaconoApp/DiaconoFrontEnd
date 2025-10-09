import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { useNavigate } from "react-router-dom";

export function ModalCadastrar2() {
    const navigate = useNavigate();
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-3">
                <TituloModal titulo={"Cadastrar Novo Membro"} />
                <div className="border border-icf-primary-50"></div>
                <EtapasCadastro corLinha="border-[#D9D9D9]" corTexto="text-icf-primary-400" className1="bg-icf-primary-100 text-icf-primary-300" className2="bg-icf-primary-200 text-icf-primary-300" />
                <label className="font-semibold text-icf-primary-400">Funções do Membro</label>
                <div className=" flex gap-14">
                    <InputIcf label={"Ministério"} />
                    <InputIcf label={"Cargo"} />
                </div>
                <label className="font-semibold text-icf-primary-400">Endereço</label>
                <div className=" flex gap-14">
                    <InputIcf label={"CEP"} />
                    <InputIcf label={"Número"} />
                </div>
                <InputIcf label={"Rua/Avenida"} />
                <div className=" flex gap-14">
                    <InputIcf label={"Bairro"} />
                    <InputIcf label={"Cidade"} />
                </div>
                <InputIcf label={"Complemento"} />
                <div className="w-full flex justify-center">
                    <div className="w-[90%] flex gap-10">
                        <BotaoIcf className="bg-icf-primary-200 flex items-center justify-center gap-2" onClick={() => navigate('/ModalCadastrar1')}>Voltar</BotaoIcf>
                        <BotaoIcf className="bg-icf-primary-400 flex items-center justify-center gap-2">Cadastrar Membro</BotaoIcf>
                    </div>
                </div>
            </div>
        </div>
    )
}