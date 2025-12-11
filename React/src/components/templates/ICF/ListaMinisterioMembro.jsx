import { useEffect, useState } from "react";
import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { FiFilter } from "react-icons/fi";
import { LinhaMinisterioMembro } from "../../molecules/ICF/LinhaMinisterioMembro";
import { ModalMembroMinisterio } from "../../molecules/ICF/ModalMembroMinisterio";
import { buscarMembrosMinisterios, buscarMinisteriosQueLidero } from "../../../services/ministerios";
import { formatarCargo, formatarTelefone, safeFormatDate, transformationName } from "../../../utils/Utils";

export function ListaMinisterioMembro() {
    const [modalAberto, setModalAberto] = useState(false);

    const [membros, setMembros] = useState([]);

    const abrirModalCriar = () => {
        setModalAberto(true);
    };

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tamanhoPagina] = useState(10);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");
    const [idMinisterio, setIdMinisterio] = useState("");

    const resetarFiltros = () => {
        setBuscaTexto("");
        setStatusSelecionado("todos");
        setPaginaAtual(0);
    };

    const formatarEmail = (email) => {
        if (!email) return "";
        return email.trim().toLowerCase();
    };

    const montarFiltros = () => {
        const filtros = {
            pagina: paginaAtual,
            tamanho: tamanhoPagina,
            busca: buscaTexto,
            idMinisterio: idMinisterio,
        };
        const statusFormatado = statusSelecionado;
        if (statusFormatado) filtros.status = statusFormatado;
        return filtros;
    };

    const carregarMembros = () => {
        buscarMembrosMinisterios(montarFiltros())
            .then((res) => {
                setMembros(res.content || []);
                setTotalPaginas(res.totalPages || 1);
            })
            .catch((err) => {
                console.error("Erro ao buscar membros do ministério:", err);
                setMembros([]);
                setTotalPaginas(1);
            });
    };

    useEffect(() => {
        carregarMembros();
    }, [paginaAtual, buscaTexto, statusSelecionado, tamanhoPagina, idMinisterio]);

    // Listar os ministérios no select
    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarMinisteriosQueLidero({})
            .then((res) => {
                const lista = res || [];
                setOptions(lista);

                // Se houver pelo menos um ministério, já seleciona o primeiro
                if (lista.length > 0) {
                    setIdMinisterio(lista[0].idExterno);
                }
            });
    }, []);

    return (
        <div className="h-full w-full bg-white p-4 flex flex-col gap-5">
            {/* Botão */}
            <div className="w-full flex justify-end">
                <div className="w-[15%]">
                    <BotaoIcf className="bg-icf-primary-400" onClick={abrirModalCriar}>Adicionar Membro +</BotaoIcf>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3 justify-end">
                <div className="w-full">
                    <InputBuscar
                        placeholder="Buscar por nome"
                        value={buscaTexto}
                        onChange={(e) => { setPaginaAtual(0); setBuscaTexto(e.target.value); }}
                    />
                </div>

                <FiFilter className="text-4xl cursor-pointer" onClick={resetarFiltros} />

                <div className="w-[40%]">
                    <select
                        value={idMinisterio}
                        onChange={(e) => {
                            setPaginaAtual(0);
                            setIdMinisterio(e.target.value);
                        }}
                        className="text-icf-primary-400 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 p-4 focus:border-icf-primary-200 focus:border-3 w-full text-[14px]"
                    >
                        {options.map((option) => (
                            <option key={option.idExterno} value={option.idExterno}>
                                {option.nome}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Lista */}
            <div className="flex justify-end">
                <ul className="flex flex-col gap-1 w-full">
                    <li className="grid grid-cols-5 bg-icf-primary-100 text-icf-primary-400 font-bold p-4">
                        {["Nome", "Email", "Celular", "Data Nascimento", "Cargo"].map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </li>

                    {membros.length === 0 ? (
                        <li className="text-center p-4 text-icf-primary-400">Nenhum membro encontrado</li>
                    ) : (
                        membros.map((m) => (
                            <LinhaMinisterioMembro
                                key={m.idExternoMembro}
                                idMembro={m.idExternoMembro}
                                idMinisterio={idMinisterio}
                                nome={transformationName(m.nome)}
                                email={formatarEmail(m.email)}
                                celular={formatarTelefone(m.numeroCelular)}
                                cargo={formatarCargo(m.cargo)}
                                dtNascimento={safeFormatDate(m.dataNascimento)}
                                onRemovido={carregarMembros}
                            />
                        ))
                    )}
                </ul>
            </div>

            {/* Paginação */}
            <div className="flex items-center gap-5 justify-center mt-4">
                {paginaAtual > 0 && (
                    <button
                        onClick={() => setPaginaAtual((prev) => prev - 1)}
                        className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded"
                    >
                        Anterior
                    </button>
                )}

                <span>Página {paginaAtual + 1} de {totalPaginas}</span>

                {paginaAtual < totalPaginas - 1 && (
                    <button
                        onClick={() => setPaginaAtual((prev) => prev + 1)}
                        className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded"
                    >
                        Próxima
                    </button>
                )}
            </div>
            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <ModalMembroMinisterio
                        onCancelar={() => setModalAberto(false)}
                        fkMinisterio={idMinisterio}
                        onMembroAdicionado={carregarMembros}
                    />
                </div>
            )}
        </div>
    );
}
