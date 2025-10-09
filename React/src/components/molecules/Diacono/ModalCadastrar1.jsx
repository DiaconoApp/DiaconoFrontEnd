import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { InputSenhaIcf } from "../../atoms/ICF/InputSenhaIcf";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { EtapasCadastro } from "../Global/EtapasCadastro";

export function ModalCadastrar1() {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Cadastrar Novo Membro"} />
                <div className="border border-icf-primary-50"></div>
                <EtapasCadastro corLinha="border-[#D9D9D9]" corTexto="text-icf-primary-400" className1="bg-icf-primary-200 text-icf-primary-300" className2="bg-icf-primary-100 text-icf-primary-300" />
                <InputIcf label={"Nome Completo"} />
                <div className=" flex gap-14">
                    <InputIcf label={"CPF"} />
                    <InputIcf label={"Data de Nascimento"} type="date" />
                </div>
                <InputIcf label={"Email"} />
                <div className=" flex gap-14">
                    <InputSenhaIcf texto={"Senha"} />
                    <InputSenhaIcf texto={"Confirmar Senha"} />
                </div>
                <div className="w-full flex justify-center gap-25">
                    <div className="w-[30%]">
                        <BotaoIcf className="bg-icf-primary-400 flex items-center justify-center gap-2">Próximo</BotaoIcf>
                    </div>
                </div>
            </div>
        </div>
    )
}