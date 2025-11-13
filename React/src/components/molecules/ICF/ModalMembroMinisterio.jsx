import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { OpcaoSelecionar } from "../../atoms/ICF/OpcaoSelecionar";
import { TituloModal } from "../../atoms/ICF/TituloModal";

const membros = [
    { id: "1", nome: "Bruna" },
    { id: "2", nome: "Marciene" },
    { id: "3", nome: "Carlos" },
    { id: "4", nome: "Ana" },
    { id: "5", nome: "João" }
];

export function ModalMembroMinisterio({onCancelar}) {
    return (
        <div className="p-6 rounded-2xl gap-4 flex flex-col bg-white shadow-menu-shadow w-160">
            <TituloModal titulo={"Adicionar Membro"} onClick={onCancelar}/>
            <div className="pt-4 border-t border-icf-primary-100">
                <InputBuscar placeholder="Buscar" />
            </div>
            {membros.length === 0 ? (
                <li className="text-center p-4 text-icf-primary-400">Nenhum membro encontrado</li>
            ) : (
                membros.map((m) => (
                    <OpcaoSelecionar key={m.id} nome={m.nome} tituloBotao={"Adicioanar"} />
                ))
            )}
            <OpcaoSelecionar nome={"Ricardo Belarmino"} tituloBotao={"Adicioanar"} />
            <div className="py-4">
                <BotaoIcf className="bg-icf-primary-400" onClick={onCancelar} > Confirmar</BotaoIcf>
            </div>
        </div>
    )

}