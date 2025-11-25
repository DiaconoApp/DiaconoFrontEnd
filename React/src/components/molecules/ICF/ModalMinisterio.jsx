import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { useState, useEffect } from "react";
import { cadastrarMinisterio, atualizarMinisterio } from "../../../services/ministerios";
import api from '../../../provider/api';
import { transformationName } from "../../../utils/Utils";
import Select from "react-select";

export function ModalMinisterio({
    tipo = "criar",
    ministerio = {},
    onSalvar,
    onCancelar
}) {
    const [nome, setNome] = useState("");
    const [idLider, setIdLider] = useState("");
    const [status, setStatus] = useState("");
    const [carregando, setCarregando] = useState(false);

    // Listar os membros no select
    const [listaMembros, setListaMembros] = useState([]);
    useEffect(() => {
        api.get('/membros')
            .then(response => {
                const membros = response.data?.content || [];
                setListaMembros(membros);
            })
            .catch(() => {
                console.log('Erro ao listar membros');
                setListaMembros([]);
            });
    }, []);

    useEffect(() => {
        if (tipo === "editar" && ministerio && listaMembros.length > 0) {
            setNome(ministerio.nome);
            setIdLider(ministerio.idLider);
            setStatus(ministerio.status);
        }
    }, [tipo, ministerio, listaMembros]);

    const titulo = tipo === "editar" ? "Editar Ministério" : "Adicionar Ministério";

    const handleSalvar = async () => {
        setCarregando(true);
        try {
            const dados = {
                nome,
                idLider, 
                status,
            };

            let resultado;

            if (tipo === "editar") {
                resultado = await atualizarMinisterio({
                    dados,
                    idMinisterio: ministerio.idExterno, 
                });
            } else {
                resultado = await cadastrarMinisterio(dados);
            }

            onSalvar(resultado);
        } catch (err) {
            alert(`Erro ao ${tipo === "editar" ? "editar" : "salvar"} ministério.`);
        } finally {
            setCarregando(false);
        }
    };


    const options = listaMembros.map((membro) => ({
        value: membro.idExterno,
        label: transformationName(membro.nome),
    }));


    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-140 py-8 px-4">
            <div className="w-[90%] flex flex-col gap-5">
                <TituloModal titulo={titulo} onClick={onCancelar} />

                <InputIcf
                    label="Nome do Ministério"
                    placeholder="Digite o nome do ministério"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <div className="flex flex-col gap-1">
                    Líder do Ministério
                    <Select className="text-sm" styles={{
                        control: (base) => ({
                            ...base,
                            padding: "4px",
                        })
                    }}
                        options={options}
                        value={options.find((opt) => opt.value === idLider)}
                        onChange={(selected) => setIdLider(selected ? selected.value : "")}
                        placeholder="Selecione um líder"
                        isClearable
                    />

                </div>

                {tipo === "editar" && (
                    <div>
                        <label className="text-sm font-medium text-icf-primary-400">Status</label>
                        <select
                            className="w-full mt-1 border border-icf-primary-200 rounded p-2 outline-none"
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
                            <BotaoIcf className="bg-icf-primary-200" onClick={onCancelar}>
                                Cancelar
                            </BotaoIcf>
                            <BotaoIcf
                                className="bg-icf-primary-400"
                                onClick={handleSalvar}
                                disabled={carregando}
                            >
                                {carregando
                                    ? tipo === "editar" ? "Editando..." : "Salvando..."
                                    : tipo === "editar" ? "Editar" : "Salvar"}

                            </BotaoIcf>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}