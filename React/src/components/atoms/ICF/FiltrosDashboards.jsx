import { FiFilter } from "react-icons/fi";
export function FiltrosDashboards({ anoInicio, setAnoInicio, anoFim, setAnoFim }) {
    const anoAtual = new Date().getFullYear();
    const anos = Array.from({ length: 5 }, (_, i) => anoAtual - i); // últimos 10 anos

    function resetarFiltros() {
        setAnoInicio(2021);
        setAnoFim(anoAtual);
    }

    return (
        <div className="flex w-full gap-4 justify-around items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:w-[40%]">

            <button onClick={resetarFiltros}>
                <FiFilter className="text-2xl text-slate-300 transition-colors hover:text-white" />
            </button>
            <select
                value={anoInicio}
                onChange={(e) => setAnoInicio(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-zinc-950 p-3 text-white outline-none"
            >
                <option value="" hidden>Ano Início</option>
                {anos.map((ano) => (
                    <option key={ano} value={ano}>{ano}</option>
                ))}
            </select>

            <select
                value={anoFim}
                onChange={(e) => setAnoFim(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-zinc-950 p-3 text-white outline-none"
            >
                <option value="" hidden>Ano Fim</option>
                {anos.map((ano) => (
                    <option key={ano} value={ano}>{ano}</option>
                ))}
            </select>
        </div>
    );
}