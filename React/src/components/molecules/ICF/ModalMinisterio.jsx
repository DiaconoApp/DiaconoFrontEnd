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
        if (tipo === "editar" && ministerio) {
            setNome(ministerio.nome || "");
            setIdLider(ministerio.idLider || "");
            setStatus(ministerio.status || "ATIVO");
        }
    }, [tipo, ministerio]);

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

    const nomeValido = nome.trim().length > 0;
    const statusValido = tipo !== "editar" || Boolean(status);
    const formularioValido = nomeValido && statusValido;


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
                        disabled={carregando || !formularioValido}
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
                                minHeight: "44px",
                                borderColor: "#d4d8dd",
                                borderRadius: "8px",
                                boxShadow: "none",
                                ":hover": {
                                    borderColor: "#7cb8b4",
                                },
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: "2px 12px",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: "#9ca3af",
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 30,
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
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setStatus("ATIVO")}
                                aria-pressed={status === "ATIVO"}
                                className={`h-11 rounded-lg border text-sm font-medium transition-colors ${
                                    status === "ATIVO"
                                        ? "bg-green-100 border-green-300 text-green-700"
                                        : "bg-white border-icf-primary-200 text-icf-primary-300 hover:bg-green-50 hover:border-green-200"
                                }`}
                            >
                                Ativo
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("INATIVO")}
                                aria-pressed={status === "INATIVO"}
                                className={`h-11 rounded-lg border text-sm font-medium transition-colors ${
                                    status === "INATIVO"
                                        ? "bg-red-100 border-red-300 text-red-700"
                                        : "bg-white border-icf-primary-200 text-icf-primary-300 hover:bg-red-50 hover:border-red-200"
                                }`}
                            >
                                Inativo
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </BaseModal>
    );
}