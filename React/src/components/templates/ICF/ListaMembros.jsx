import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { LinhaMembro } from "../../molecules/ICF/LinhaMembro";
import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { buscarMinisterios } from "../../../services/ministerios";
import { transformationName, formatarTelefone, safeFormatDate } from "../../../utils/Utils";
import { FormMembro } from "../../molecules/ICF/FormMembro";
import { buscarMembros } from "../../../services/membros";

export function ListaMembros() {

    const [abrirForm, setAbrirForm] = useState(false);

    const [membros, setMembros] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tamanhoPagina, setTamanhoPagina] = useState(10);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("todos");
    const [fkMinisterio, setFkMinisterio] = useState("");

    const resetarFiltros = () => {
        setBuscaTexto("");
        setStatusSelecionado("todos");
        setFkMinisterio("");
        setPaginaAtual(0);
    };


    const formatarStatus = (status) => {
        if (!status) return "";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };
    const adaptarStatus = (status) => {
        const s = status.trim().toLowerCase();
        if (s === "ativos") return "ATIVO";
        if (s === "inativos") return "INATIVO";
        return "";
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
            fkMinisterio,
        };
        const statusFormatado = adaptarStatus(statusSelecionado);
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
    }, [paginaAtual, buscaTexto, statusSelecionado, tamanhoPagina, fkMinisterio]);

    // Listar os ministérios no select
    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarMinisterios({})
            .then((res) => setOptions(res.content || []));
    }, []);

    return (
        <div className="h-full w-full bg-white p-4 flex flex-col gap-5">
            {abrirForm ? (
                <FormMembro fecharFormulario={() => { setAbrirForm(false); carregarMembros(); }} />
            ) : (
                <>

                    <div className="w-full flex justify-end">
                        <div className="w-[15%]">
                            <BotaoIcf className="bg-icf-primary-400" onClick={() => { setAbrirForm(true) }}>
                                Cadastrar Membro +
                            </BotaoIcf>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                        <div className="w-full">
                            <InputBuscar
                                placeholder="Buscar por nome, email, ou celular"
                                value={buscaTexto}
                                onChange={(e) => { setPaginaAtual(0); setBuscaTexto(e.target.value); }}
                            />
                        </div>

                        <span className="font-medium text-icf-primary-400">Status:</span>
                        <div className="flex gap-4">
                            {["todos", "ativos", "inativos"].map((filtro) => (
                                <button
                                    key={filtro}
                                    onClick={() => { setPaginaAtual(0); setStatusSelecionado(filtro); }}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium ${statusSelecionado === filtro ? "bg-icf-primary-400 text-white" : "text-icf-primary-200 border border-icf-primary-200 hover:bg-icf-primary-50"}`}
                                >
                                    {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                                </button>
                            ))}
                        </div>

                        <FiFilter className="text-4xl cursor-pointer" onClick={resetarFiltros} />

                        <div className="w-[40%]">
                            <SelectIcf
                                opt1={<option value="">Todos os ministérios</option>}
                                opt2={<option value="null">Nenhum</option>}
                                options={options}
                                value={fkMinisterio}
                                onChange={(val) => { setPaginaAtual(0); setFkMinisterio(val); }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <ul className="flex flex-col gap-1 w-full">
                            <li className="grid grid-cols-7 bg-icf-primary-100 text-icf-primary-400 font-bold p-4">
                                {["Nome", "Email", "Celular", "Data Nascimento", "Ministério", "Status"].map((label) => (
                                    <span key={label}>{label}</span>
                                ))}
                            </li>

                            {membros.length === 0 ? (
                                <li className="text-center p-4 text-icf-primary-400">Nenhum membro encontrado</li>
                            ) : (
                                membros.map((membro) => (
                                    <LinhaMembro
                                        key={membro.idExterno}
                                        nome={transformationName(membro.nome)}
                                        email={formatarEmail(membro.email)}
                                        celular={formatarTelefone(membro.celular)}
                                        nascimento={safeFormatDate(membro.dataNascimento)}
                                        ministério={
                                            membro.ministerios && membro.ministerios.length > 0 ? (
                                                <div className="flex flex-col">
                                                    {Array.from({ length: Math.ceil(membro.ministerios.length / 3) }).map((_, i) => (
                                                        <span key={i}>
                                                            {membro.ministerios
                                                                .slice(i * 3, i * 3 + 3)
                                                                .map(m => transformationName(m.nomeMinisterio))
                                                                .join(", ")}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                "Nenhum"
                                            )
                                        }
                                        qtdMinistério={membro.ministerios?.length || 0}
                                        status={formatarStatus(membro.status)}
                                    />
                                ))
                            )}
                        </ul>
                    </div>

                    <div className="flex items-center gap-5 justify-center mt-4">
                        {paginaAtual > 0 && (
                            <button onClick={() => setPaginaAtual((prev) => prev - 1)} className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded">Anterior</button>
                        )}

                        <span>Página {paginaAtual + 1}</span>

                        {paginaAtual < totalPaginas - 1 && (
                            <button onClick={() => setPaginaAtual(paginaAtual + 1)} className="px-4 py-2 bg-icf-primary-200 text-icf-primary-400 rounded">Próxima</button>
                        )}
                    </div>
                </>
            )}
        </div>

    );
}