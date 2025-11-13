import { useEffect, useState } from "react";
import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { FiFilter } from "react-icons/fi";
import { LinhaMinisterio } from "../../molecules/ICF/LinhaMinisterio";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { ModalMinisterio } from "../../molecules/ICF/ModalMinisterio";

export function ListaMinisterios() {
    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [ministerioSelecionado, setMinisterioSelecionado] = useState(null);

    const abrirModalCriar = () => {
        setModoEdicao(false);
        setModalAberto(true);
    };

    const abrirModalEditar = (ministerio) => {
        setModoEdicao(true);
        setMinisterioSelecionado(ministerio);
        setModalAberto(true);
    };

    const [ministerios, setMinisterios] = useState([]);
    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [tamanhoPagina] = useState(5);

    // --- MOCK DE DADOS ---
    const dadosMock = [
        { id: 1, nome: "Louvor", lider: "Maria Silva", status: "Ativo", dataCriacao: "01/02/2023" },
        { id: 2, nome: "Intercessão", lider: "João Pereira", status: "Ativo", dataCriacao: "15/04/2023" },
        { id: 3, nome: "Dança", lider: "Ana Souza", status: "Inativo", dataCriacao: "20/08/2022" },
        { id: 4, nome: "Teatro", lider: "Lucas Costa", status: "Ativo", dataCriacao: "09/01/2024" },
        { id: 5, nome: "Mídia", lider: "Carla Dias", status: "Ativo", dataCriacao: "11/03/2023" },
        { id: 6, nome: "Recepção", lider: "Paulo Henrique", status: "Inativo", dataCriacao: "25/07/2022" },
        { id: 7, nome: "Infantil", lider: "Laura Ramos", status: "Ativo", dataCriacao: "03/06/2023" },
    ];

    // --- FILTRAGEM E PAGINAÇÃO ---
    useEffect(() => {
        let filtrados = dadosMock;

        if (buscaTexto) {
            filtrados = filtrados.filter((m) =>
                m.nome.toLowerCase().includes(buscaTexto.toLowerCase())
            );
        }

        if (statusSelecionado !== "todos") {
            filtrados = filtrados.filter(
                (m) => m.status.toLowerCase() === statusSelecionado.toLowerCase()
            );
        }

        const inicio = paginaAtual * tamanhoPagina;
        const fim = inicio + tamanhoPagina;

        setMinisterios(filtrados.slice(inicio, fim));
    }, [buscaTexto, statusSelecionado, paginaAtual]);

    const resetarFiltros = () => {
        setBuscaTexto("");
        setStatusSelecionado("todos");
        setPaginaAtual(0);
    };

    const totalPaginas = Math.ceil(
        dadosMock.filter(
            (m) =>
                (statusSelecionado === "todos" ||
                    m.status.toLowerCase() === statusSelecionado.toLowerCase()) &&
                (!buscaTexto || m.nome.toLowerCase().includes(buscaTexto.toLowerCase()))
        ).length / tamanhoPagina
    );

    var governo = false;
    return (
        <div className="h-full w-full bg-white p-4 flex flex-col gap-5">
            {/* Botão */}
            <div className="w-full flex justify-end">
                <div className="w-[15%]">
                    <BotaoIcf className="bg-icf-primary-400" onClick={abrirModalCriar}>Cadastrar Ministério +</BotaoIcf>
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

                <span className="font-medium text-icf-primary-400">Status:</span>
                <div className="flex gap-4">
                    {["todos", "Ativo", "Inativo"].map((filtro) => (
                        <button
                            key={filtro}
                            onClick={() => { setPaginaAtual(0); setStatusSelecionado(filtro.toLowerCase()); }}
                            className={`px-6 py-2 rounded-lg text-sm font-medium ${statusSelecionado === filtro.toLowerCase()
                                ? "bg-icf-primary-400 text-white"
                                : "text-icf-primary-200 border border-icf-primary-200 hover:bg-icf-primary-50"}`}
                        >
                            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                        </button>
                    ))}
                </div>

                <FiFilter className="text-4xl cursor-pointer" onClick={resetarFiltros} />

                {governo && (
                    <div className="w-[40%]">
                        <SelectIcf
                            opt1={<option value="">Todos os ministérios</option>}
                            opt2={<option value="null">Nenhum</option>}
                        // options={options}
                        // value={fkMinisterio}
                        // onChange={(val) => { setPaginaAtual(0); setFkMinisterio(val); }}
                        />
                    </div>
                )
                }
            </div>

            {/* Lista */}
            <div className="flex justify-end">
                <ul className="flex flex-col gap-1 w-full">
                    <li className="grid grid-cols-4 bg-icf-primary-100 text-icf-primary-400 font-bold p-4">
                        {["Nome do Ministério", "Líder", "Status", "Data de criação"].map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </li>

                    {ministerios.length === 0 ? (
                        <li className="text-center p-4 text-icf-primary-400">Nenhum ministério encontrado</li>
                    ) : (
                        ministerios.map((m) => (
                            <LinhaMinisterio
                                key={m.id}
                                nome={m.nome}
                                lider={m.lider}
                                status={m.status}
                                onEditar={() => abrirModalEditar(m)}
                                dataCriacao={m.dataCriacao}
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
                    <ModalMinisterio
                        tipo={modoEdicao ? "editar" : "criar"}
                        ministerio={ministerioSelecionado}
                        onSalvar={(dados) => {
                            console.log("Salvando:", dados);
                            setModalAberto(false);
                        }}
                        onCancelar={() => setModalAberto(false)}
                    />
                </div>
            )}
        </div>
    );
}
