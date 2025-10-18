import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { LiinhaMembro } from "../../molecules/ICF/LinhaMembro";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { ModalCadastrar1 } from "../../molecules/ICF/ModalCadastrar1";
import { ModalCadastrar2 } from "../../molecules/ICF/ModalCadastrar2";

export function ListaMembros() {
    const [filtroSelecionado, setFiltroSelecionado] = useState("todos");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [etapaCadastro, setEtapaCadastro] = useState(1);

    return (
        <div className="h-full w-full bg-white p-4 flex flex-col gap-5">
            <div className="w-full flex justify-end">
                <div className="w-[15%]">
                    <BotaoIcf className="bg-icf-primary-400" onClick={() => { setMostrarModal(true); setEtapaCadastro(1) }}>Cadastrar Membro +</BotaoIcf>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
                <div className="w-full">
                    <InputBuscar placeholder="Buscar por nome, email, ou celular" />
                </div>
                <span className="font-medium text-icf-primary-400">Status:</span>
                <div className="flex gap-4">
                    {["todos", "ativos", "inativos"].map((filtro) => (
                        <button
                            key={filtro}
                            onClick={() => setFiltroSelecionado(filtro)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium
                             ${filtroSelecionado === filtro
                                    ? "bg-icf-primary-400 text-white"
                                    : "text-icf-primary-200 border border-icf-primary-200 hover:bg-icf-primary-50"}`}>
                            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                        </button>
                    ))}
                </div>
                <FiFilter className="text-4xl" />
                <div className="w-[40%]">
                    <SelectIcf />
                </div>
            </div>
            <div className="flex justify-end">
                <ul className="flex flex-col gap-1 w-full">
                    <li className="grid grid-cols-7 bg-icf-primary-100 text-icf-primary-400 font-bold p-4">
                        {["Nome", "Email", "Celular", "Data Nascimento", "Ministério", "Status"].map((label) => (
                            <span>{label}</span>
                        ))}
                    </li>
                    <LiinhaMembro nome="Mariana Alves" email="marianaalves@gmail.com" celular="(11)91234-5678" nascimento="20/10/2002" ministério="Ministério de Louvor" qtdMinistério="4" status="Ativo" key="1" />
                </ul>
            </div>
            {mostrarModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    {etapaCadastro === 1 && (
                        <ModalCadastrar1
                            onClose={() => setMostrarModal(false)}
                            onNext={() => setEtapaCadastro(2)}
                        />
                    )}
                    {etapaCadastro === 2 && (
                        <ModalCadastrar2
                            onClose={() => { setMostrarModal(false) }}
                            onBack={() => { setEtapaCadastro(1) }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}