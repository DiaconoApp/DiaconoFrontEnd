import { useEffect, useState } from "react";
import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { FiFilter } from "react-icons/fi";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { LinhaMinisterioMembro } from "../../molecules/ICF/LinhaMinisterioMembro";
import { ModalMembroMinisterio } from "../../molecules/ICF/ModalMembroMinisterio";

export function ListaMinisterioMembro() {
    const [modalAberto, setModalAberto] = useState(false);

    const abrirModalCriar = () => {
        setModoEdicao(false);
        setModalAberto(true);
    };

    const [ministerios, setMinisterios] = useState([]);
    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [tamanhoPagina] = useState(5);

    // --- MOCK DE DADOS ---
    const dadosMock = [
        { id: 1, nome: "Maria", email: "maria.silva@gmail.com", celular: "11912345678", dtNascimento: "01/02/2023", cargo: "Líder" },
        { id: 2, nome: "João", email: "joao.pereira@gmail.com", celular: "11912345678", dtNascimento: "15/04/2023", cargo: "Líder"},
        { id: 3, nome: "Ana", email: "ana.souza@gmail.com", celular: "In11912345678", dtNascimento: "20/08/2022", cargo: "Líder"},
        { id: 4, nome: "Lucas", email: "lucas.costa@gmail.com", celular: "11912345678", dtNascimento: "09/01/2024", cargo: "Líder"},
        { id: 5, nome: "Carla", email: "carla.dias@gmail.com", celular: "11912345678", dtNascimento: "11/03/2023", cargo: "Líder" },
        { id: 6, nome: "Paulo", email: "paulo.henrique@gmail.com", celular: "11912345678", dtNascimento: "25/07/2022", cargo: "Líder"},
        { id: 7, nome: "Laura", email: "laura.ramos@gmail.com", celular: "11912345678", dtNascimento: "03/06/2023", cargo: "Líder"},
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

    var governo = true;
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

                <span className="font-medium text-icf-primary-400">Status:</span>
                <div className="flex gap-4">
                    {["todos", "Ativo", "Inativo"].map((filtro) => (
                        <button
                            key={filtro}
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
                    <li className="grid grid-cols-5 bg-icf-primary-100 text-icf-primary-400 font-bold p-4">
                        {["Nome", "Email", "Celular", "Data Nascimento", "Cargo"].map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </li>

                    {ministerios.length === 0 ? (
                        <li className="text-center p-4 text-icf-primary-400">Nenhum ministério encontrado</li>
                    ) : (
                        ministerios.map((m) => (
                            <LinhaMinisterioMembro
                                key={m.id}
                                nome={m.nome}
                                email={m.email}
                                celular={m.celular}
                                cargo={m.cargo}
                                dtNascimento={m.dtNascimento}
                                
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
                    />
                </div>
            )}
        </div>
    );
}
