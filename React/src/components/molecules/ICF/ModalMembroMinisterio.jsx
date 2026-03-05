import { BaseModal } from "../../atoms/ICF/BaseModal";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { OpcaoSelecionar } from "../../atoms/ICF/OpcaoSelecionar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { buscarMembros } from "../../../services/membros";
import { transformationName } from "../../../utils/Utils";
import { adicionarMembroMinisterio } from "../../../services/ministerios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ModalMembroMinisterio({ onCancelar, fkMinisterio, onMembroAdicionado }) {
    const [membros, setMembros] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tamanhoPagina, setTamanhoPagina] = useState(5);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");

    const montarFiltros = () => {
        const filtros = {
            pagina: paginaAtual,
            tamanho: tamanhoPagina,
            busca: buscaTexto,
        };
        const statusFormatado = statusSelecionado;
        if (statusFormatado) filtros.status = statusFormatado;
        return filtros;
    };

    const carregarMembros = () => {
        buscarMembros(montarFiltros())
            .then((res) => {
                setMembros(res.content || []);
                setTotalPaginas(res.totalPages || 1);
            })
            .catch((err) => {
                console.error("Erro ao buscar membros:", err);
                setMembros([]);
                setTotalPaginas(1);
            });
    };

    useEffect(() => {
        carregarMembros();
    }, [paginaAtual, buscaTexto, statusSelecionado, tamanhoPagina]);

    return (
        <BaseModal
            title="Adicionar Membro"
            onClose={onCancelar}
            size="lg"
            footer={
                <Button
                    onClick={onCancelar}
                    className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white"
                >
                    Confirmar
                </Button>
            }
        >
            <div className="space-y-4">
                <InputBuscar
                    placeholder="Buscar por nome"
                    value={buscaTexto}
                    onChange={(e) => { setPaginaAtual(0); setBuscaTexto(e.target.value); }}
                />

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {membros.length === 0 ? (
                        <p className="text-center p-4 text-icf-primary-300">Nenhum membro encontrado</p>
                    ) : (
                        membros.map((m) => {
                            const jaNoMinisterio = m.ministerios?.some(
                                (min) => min.idExternoMinisterio === fkMinisterio
                            );

                            return (
                                <OpcaoSelecionar
                                    key={m.idExterno}
                                    id={m.idExterno}
                                    nome={transformationName(m.nome)}
                                    tituloBotao={jaNoMinisterio ? "Adicionado" : "Adicionar"}
                                    jaNoMinisterio={jaNoMinisterio}
                                    onClick={async (idMembro) => {
                                        try {
                                            await adicionarMembroMinisterio({
                                                dados: { idMembro },
                                                idMinisterio: fkMinisterio,
                                            });
                                            alert(`Membro ${m.nome} adicionado com sucesso!`);
                                            if (onMembroAdicionado) onMembroAdicionado();
                                            onCancelar();
                                        } catch (err) {
                                            alert("Erro ao atualizar membro");
                                        }
                                    }}
                                />
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaginaAtual((prev) => prev - 1)}
                        disabled={paginaAtual === 0}
                        className="border-icf-primary-200 text-icf-primary-400"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                    </Button>
                    <span className="text-sm text-icf-primary-300">
                        Página {paginaAtual + 1} de {totalPaginas}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaginaAtual(paginaAtual + 1)}
                        disabled={paginaAtual >= totalPaginas - 1}
                        className="border-icf-primary-200 text-icf-primary-400"
                    >
                        Próxima
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </BaseModal>
    );

}