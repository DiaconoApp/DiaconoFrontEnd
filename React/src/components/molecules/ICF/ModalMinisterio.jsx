import { BaseModal } from "../../atoms/ICF/BaseModal";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cadastrarMinisterio, atualizarMinisterio } from "../../../services/ministerios";
import api from '../../../provider/api';
import { transformationName } from "../../../utils/Utils";
import Select from "react-select";
import { AlertModal } from "../../ui/AlertModal";

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
    const [modal, setModal] = useState(null);

    // Listar os membros no select
    const [listaMembros, setListaMembros] = useState([]);
    useEffect(() => {
        const fetchAllMembros = async () => {
            let page = 0;
            let allMembros = [];
            let totalPages = 1;

            try {
                while (page < totalPages) {
                    const res = await api.get(`/membros?page=${page}&size=50&sort=nome`);
                    const { content, totalPages: tp } = res.data;
                    allMembros = [...allMembros, ...content];
                    totalPages = tp;
                    page++;
                }
                setListaMembros(allMembros);
            } catch (err) {
                console.error("Erro ao listar membros", err);
                setListaMembros([]);
            }
        };

        fetchAllMembros();
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
                setModal({
                    type: "success",
                    title: "Sucesso!",
                    message: "Ministério editado com sucesso!",
                    autoClose: 2000
                });
            } else {
                resultado = await cadastrarMinisterio(dados);
                setModal({
                    type: "success",
                    title: "Sucesso!",
                    message: "Ministério cadastrado com sucesso!",
                    autoClose: 2000
                });
            }

            setTimeout(() => {
                onSalvar(resultado);
            }, 2000);
        } catch (err) {
            setModal({
                type: "error",
                title: "Erro",
                message: `Erro ao ${tipo === "editar" ? "editar" : "salvar"} ministério.`
            });
        } finally {
            setCarregando(false);
        }
    };


    const options = listaMembros.map((membro) => ({
        value: membro.idExterno,
        label: transformationName(membro.nome),
    }));


    return (
        <BaseModal
            title={titulo}
            onClose={onCancelar}
            size="md"
            allowOverflow={true}
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onCancelar}
                        className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSalvar}
                        disabled={carregando}
                        className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white"
                    >
                        {carregando
                            ? tipo === "editar" ? "Editando..." : "Salvando..."
                            : tipo === "editar" ? "Editar" : "Salvar"}
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                <InputIcf
                    label="Nome do Ministério"
                    placeholder="Digite o nome do ministério"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-icf-primary-400">Líder do Ministério</label>
                    <Select 
                        className="text-sm" 
                        styles={{
                            control: (base) => ({
                                ...base,
                                padding: "4px",
                                borderColor: "#c9c9c9",
                                borderRadius: "8px",
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
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-icf-primary-400">Status</label>
                        <select
                            className="w-full border border-icf-primary-200 rounded-lg p-1 outline-none focus:ring-1 focus:ring-icf-primary-200 text-xs"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </select>
                    </div>
                )}
            </div>
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </BaseModal>
    );
}