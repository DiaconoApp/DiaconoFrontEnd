import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { useState, useEffect } from "react";

export function ModalMinisterio({
    tipo = "criar",
    ministerio = {},
    onSalvar,
    onCancelar
}) {

    const [nome, setNome] = useState("");
    const [lider, setLider] = useState("");
    const [status, setStatus] = useState("Ativo");

    // Se for edição, preenche os campos automaticamente
    useEffect(() => {
        if (tipo === "editar" && ministerio) {
            setNome(ministerio.nome || "");
            setLider(ministerio.lider || "");
            setStatus(ministerio.status || "Ativo");
        }
    }, [tipo, ministerio]);

    const titulo = tipo === "editar" ? "Editar Ministério" : "Adicionar Ministério";

    const handleSalvar = () => {
        const novoMinisterio = { nome, lider, status };
        onSalvar(novoMinisterio);
    };

    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-140 py-8 px-4">
            <div className="w-[90%] flex flex-col gap-5">
                <TituloModal titulo={titulo} onClick={onCancelar}/>

                <InputIcf
                    label="Nome do Ministério"
                    placeholder="Digite o nome do ministério"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <InputIcf
                    label="Líder"
                    placeholder="Digite o líder"
                    value={lider}
                    onChange={(e) => setLider(e.target.value)}
                />

                {/* Campo extra aparece só na edição */}
                {tipo === "editar" && (
                    <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="w-full mt-1 border rounded p-2 outline-none"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    <div className="flex justify-end gap-6 pt-4">
                        <div className="w-[60%] flex gap-4">
                            <BotaoIcf className="bg-icf-primary-400">Salvar</BotaoIcf>
                            <BotaoIcf className="bg-icf-primary-200" onClick={onCancelar}>Cancelar</BotaoIcf>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
