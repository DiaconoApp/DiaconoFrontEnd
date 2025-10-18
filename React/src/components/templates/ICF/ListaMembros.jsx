import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { LinhaMembro } from "../../molecules/ICF/LinhaMembro";
import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { ModalCadastrar1 } from "../../molecules/ICF/ModalCadastrar1";
import { ModalCadastrar2 } from "../../molecules/ICF/ModalCadastrar2";
import api from "../../../provider/api"

export function ListaMembros() {
    const [filtroSelecionado, setFiltroSelecionado] = useState("todos");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [etapaCadastro, setEtapaCadastro] = useState(1);
    const [membros, setMembros] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [buscaTexto, setBuscaTexto] = useState("");

    const formatarStatus = (texto) => {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };

    const statusMap = {
        ativos: "ATIVO",
        inativos: "INATIVO"
    };

    useEffect(() => {
        let url = `/membros?_page=${paginaAtual}&_limit=10`;

        if (buscaTexto.trim() !== "") {
            url += `&q=${encodeURIComponent(buscaTexto.trim())}`;
        }

        if (filtroSelecionado !== "todos") {
            const statusFiltrado = statusMap[filtroSelecionado];
            if (statusFiltrado) {
                url += `&status=${statusFiltrado}`;
            }
        }

        api.get(url)
            .then((res) => {
                setMembros(res.data);
                const total = parseInt(res.headers["x-total-count"], 10);
                setTotalPaginas(Math.ceil(total / 10));
            })
            .catch((err) => console.error("Erro ao buscar usuários:", err));
    }, [paginaAtual, filtroSelecionado, buscaTexto]);


    return (
        <div className="h-full w-full bg-white p-4 flex flex-col gap-5">
            <div className="w-full flex justify-end">
                <div className="w-[15%]">
                    <BotaoIcf className="bg-icf-primary-400" onClick={() => { setMostrarModal(true); setEtapaCadastro(1) }}>Cadastrar Membro +</BotaoIcf>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
                <div className="w-full">
                    <InputBuscar placeholder="Buscar por nome, email, ou celular" value={buscaTexto} onChange={(e) => { setPaginaAtual(1); setBuscaTexto(e.target.value) }} />
                </div>
                <span className="font-medium text-icf-primary-400">Status:</span>
                <div className="flex gap-4">
                    {["todos", "ativos", "inativos"].map((filtro) => (
                        <button
                            key={filtro}
                            onClick={() => { setPaginaAtual(1); setFiltroSelecionado(filtro) }}
                            className={`px-6 py-2 rounded-lg text-sm font-medium
                                ${filtroSelecionado === filtro
                                    ? "bg-icf-primary-400 text-white"
                                    : "text-icf-primary-200 border border-icf-primary-200 hover:bg-icf-primary-50"}`}>
                            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                        </button>
                    ))}
                </div>
                <FiFilter className="text-4xl" />
                <div className="w-[40%]">
                    <SelectIcf />
                </div>
            </div>
            <div className="flex justify-end">
                <ul className="flex flex-col gap-1 w-full">
                    <li className="grid grid-cols-7 bg-icf-primary-100 text-icf-primary-400 font-bold p-4">
                        {["Nome", "Email", "Celular", "Data Nascimento", "Ministério", "Status"].map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </li>
                    {membros.length == 0 ? (
                        <li className="text-center p-4 text-icf-primary-400">Nenhum membro encontrado</li>
                    ) : (membros.map((membro) => (
                        <LinhaMembro key={membro.idExterno} nome={membro.nome} email={membro.email} celular={membro.celular} nascimento={new Date(membro.dataNascimento).toLocaleDateString("pt-BR")} ministério={membro.ministerios?.[0]?.nomeMinisterio || "Nenhum"} qtdMinistério={membro.ministerios?.length || 0} status={formatarStatus(membro.status)} />
                    )))}
                </ul>
            </div>
            {mostrarModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    {etapaCadastro === 1 && (
                        <ModalCadastrar1
                            onClose={() => setMostrarModal(false)}
                            onNext={() => setEtapaCadastro(2)}
                        />
                    )}
                    {etapaCadastro === 2 && (
                        <ModalCadastrar2
                            onClose={() => { setMostrarModal(false) }}
                            onBack={() => { setEtapaCadastro(1) }}
                        />
                    )}
                </div>
            )}
            <div className="flex items-center gap-5 justify-center mt-4">
                {paginaAtual > 1 && (
                    <button
                        onClick={() => setPaginaAtual((prev) => prev - 1)}
                        className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded"
                    >
                        Anterior
                    </button>
                )}

                <span>Página {paginaAtual}</span>

                {paginaAtual < totalPaginas && (
                    <button
                        onClick={() => setPaginaAtual((prev) => prev + 1)}
                        className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded"
                    >
                        Próxima
                    </button>
                )}
            </div>
        </div>
    );
}