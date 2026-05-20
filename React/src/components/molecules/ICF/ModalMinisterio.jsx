import { BaseModal } from "../../atoms/ICF/BaseModal";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
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
                    const res = await api.get(`/api/v1/membros?page=${page}&size=50&sort=nome`);
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

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-icf-primary-400">Líder do Ministério</label>
                    <Select
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                height: "40px",
                                minHeight: "40px",
                                backgroundColor: "#FCFCFC",
                                borderColor: state.isFocused ? "#595959" : "#D9D9D9",
                                borderRadius: "8px",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#D9D9D9" },
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                height: "40px",
                                padding: "0 16px",
                            }),
                            input: (base) => ({
                                ...base,
                                margin: 0,
                                padding: 0,
                                color: "#1C1C1C",
                                fontSize: "14px",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: "#A6A6A6",
                                fontSize: "14px",
                                margin: 0,
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "#1C1C1C",
                                fontSize: "14px",
                                margin: 0,
                            }),
                            indicatorsContainer: (base) => ({
                                ...base,
                                height: "40px",
                            }),
                            indicatorSeparator: () => ({ display: "none" }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                color: "#A6A6A6",
                                padding: "0 8px",
                            }),
                        }}
                        options={options}
                        value={options.find((opt) => opt.value === idLider)}
                        onChange={(selected) => setIdLider(selected ? selected.value : "")}
                        placeholder="Selecione um líder"
                        isClearable
                    />
                </div>

                {tipo === "editar" && (
                    <SelectIcf
                        label="Status"
                        options={[
                            { idExterno: "ATIVO", nome: "Ativo" },
                            { idExterno: "INATIVO", nome: "Inativo" },
                        ]}
                        value={status}
                        onChange={(valor) => setStatus(valor)}
                    />
                )}
            </div>
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </BaseModal>
    );
}