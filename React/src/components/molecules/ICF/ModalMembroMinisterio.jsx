import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { OpcaoSelecionar } from "../../atoms/ICF/OpcaoSelecionar";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import { useEffect, useState } from "react";
import { buscarMembros } from "../../../services/membros";
import { transformationName } from "../../../utils/Utils";
import { adicionarMembroMinisterio, removerMembroMinisterio } from "../../../services/ministerios";
import { AlertModal } from "../../ui/AlertModal";

export function ModalMembroMinisterio({ onCancelar, fkMinisterio, onMembroAdicionado }) {
    const [membros, setMembros] = useState([]);
    const [modal, setModal] = useState(null);

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
        <div className="p-6 rounded-2xl gap-4 flex flex-col bg-white shadow-menu-shadow w-160">
            <TituloModal titulo={"Adicionar Membro"} onClose={onCancelar} />
            <div className="pt-4 border-t border-icf-primary-100">
                <InputBuscar
                    placeholder="Buscar por nome"
                    value={buscaTexto}
                    onChange={(e) => { setPaginaAtual(0); setBuscaTexto(e.target.value); }} />
            </div>
            {membros.length === 0 ? (
                <li className="text-center p-4 text-icf-primary-400">Nenhum membro encontrado</li>
            ) : (
                membros.map((m) => {
                    // verifica se o membro já pertence ao ministério atual
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
                                    // lógica de adição
                                    await adicionarMembroMinisterio({
                                        dados: { idMembro },
                                        idMinisterio: fkMinisterio,
                                    });
                                    setModal({
                                        type: "success",
                                        title: "Sucesso",
                                        message: `Membro ${m.nome} adicionado com sucesso!`,
                                        autoClose: 2000
                                    });

                                    if (onMembroAdicionado) {
                                        onMembroAdicionado();
                                    }
                                    setTimeout(() => {
                                        onCancelar();
                                    }, 2000);
                                } catch (err) {
                                    setModal({
                                        type: "error",
                                        title: "Erro",
                                        message: "Erro ao atualizar membro"
                                    });
                                }
                            }}
                        />
                    );
                })
            )}
            <div className="flex items-center gap-5 justify-center mt-4">
                {paginaAtual > 0 && (
                    <button onClick={() => setPaginaAtual((prev) => prev - 1)} className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded">Anterior</button>
                )}

                <span>Página {paginaAtual + 1}</span>

                {paginaAtual < totalPaginas - 1 && (
                    <button onClick={() => setPaginaAtual(paginaAtual + 1)} className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded">Próxima</button>
                )}
            </div>
            <div className="py-4">
                <BotaoIcf className="bg-icf-primary-400" onClick={onCancelar} > Confirmar</BotaoIcf>
            </div>
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </div>
    )

}