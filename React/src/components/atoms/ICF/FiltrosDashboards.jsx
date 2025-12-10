import { FiFilter } from "react-icons/fi";
export function FiltrosDashboards({ anoInicio, setAnoInicio, anoFim, setAnoFim }) {
    const anoAtual = new Date().getFullYear();
    const anos = Array.from({ length: 5 }, (_, i) => anoAtual - i); // últimos 10 anos

    function resetarFiltros() {
        setAnoInicio(2021);
        setAnoFim(anoAtual);
    }

    return (
        <div className="flex w-[30%] gap-4 justify-around items-center">

            <button onClick={resetarFiltros}>
                <FiFilter className="hover:text-icf -primary-300 text-icf-primary-200 text-2xl" />
            </button>
            <select
                value={anoInicio}
                onChange={(e) => setAnoInicio(Number(e.target.value))}
                className="p-3 w-full border border-[#AEAEB2] rounded-lg text-[#AEAEB2] bg-white shadow-sm"
            >
                <option value="" hidden>Ano Início</option>
                {anos.map((ano) => (
                    <option key={ano} value={ano}>{ano}</option>
                ))}
            </select>

            <select
                value={anoFim}
                onChange={(e) => setAnoFim(Number(e.target.value))}
                className="p-3 w-full border border-[#AEAEB2] rounded-lg text-[#AEAEB2] bg-white shadow-sm"
            >
                <option value="" hidden>Ano Fim</option>
                {anos.map((ano) => (
                    <option key={ano} value={ano}>{ano}</option>
                ))}
            </select>
        </div>
    );
}