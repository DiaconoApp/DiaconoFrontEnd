import { useEffect, useState } from "react";
import { Kpi } from "../../molecules/ICF/Kpi";
import GraficoEvolucaoMembros from "../../atoms/ICF/GraficoEvolucaoMembros";
import GraficoDistribuicaoMembros from "../../atoms/ICF/GraficoDistribuicaoMembros";
import { GraficoEvolucaoMembrosMinisterio } from "../../atoms/ICF/GraficoEvolucaoMembrosMinisterios";
import { GraficoMembrosPorMinisterios } from "../../atoms/ICF/GraficoMembrosPorMinisterios";
import { GraficoEventosPorMinisterio } from "../../atoms/ICF/GraficoEventosPorMinisterios";
import { getKpisMembros, getKpisMinisterios } from "../../../services/dashboards";

const tabs = [
    { id: "membros", label: "Membros" },
    { id: "ministerios", label: "Ministérios" },
];

export function Dashboard() {
    const [activeTab, setActiveTab] = useState("membros");
    const [menuAberto, setMenuAberto] = useState(true);

    const [kpis, setKpis] = useState({});
    const anoAtual = new Date().getFullYear();

    const [anoInicio, setAnoInicio] = useState(2021);
    const [anoFim, setAnoFim] = useState(anoAtual);

    useEffect(() => {
        async function carregar() {
            try {
                if (activeTab === "membros") {
                    const res = await getKpisMembros(anoInicio, anoFim);
                    setKpis({
                        membrosAtivos: res.membrosAtivos,
                        novosMembros: res.membrosNovos,
                        retencao: res.retencao
                    });
                } else {
                    const res = await getKpisMinisterios(anoInicio, anoFim);
                    setKpis({
                        totalMinisterios: res?.ministerioKpisResponseDTO?.ministeriosAtivos,
                        totalMembroMinisterio: res?.ministerioKpisResponseDTO?.mediaMembrosMinisterio,
                        ministerioEngajado: res?.eventoKpiDTO?.nomeMinisterio
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar KPIs:", err);
            }
        }

        carregar();
    }, [activeTab, anoInicio, anoFim]);

    const espacamento = menuAberto ? "ml-70" : "ml-24.5";

    return (
        <div className="bg-[#050505] min-h-screen text-white flex flex-col gap-6 pb-8">
            <div className={`grid grid-cols-3 gap-5 mt-15 p-6 transition-all duration-300 ${espacamento}`}>
                <div>
                    <h1 className="font-bold text-2xl text-white uppercase tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Visão consolidada dos indicadores</p>
                </div>
            </div>

            <div className={`${espacamento} px-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between`}>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`border-b-2 px-1 pb-1 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-white text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="w-full lg:w-auto rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 text-slate-300">
                            <span className="text-lg">Filtro</span>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <select
                                value={anoInicio}
                                onChange={(e) => setAnoInicio(Number(e.target.value))}
                                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
                            >
                                {Array.from({ length: 5 }, (_, i) => anoAtual - i).map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>

                            <select
                                value={anoFim}
                                onChange={(e) => setAnoFim(Number(e.target.value))}
                                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
                            >
                                {Array.from({ length: 5 }, (_, i) => anoAtual - i).map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === "membros" && (
                <>
                    <div className={`${espacamento} mt-2 px-6 grid grid-cols-1 gap-4 md:grid-cols-3`}>
                        <Kpi icon="users" titulo="Membros ativos" valor={kpis.membrosAtivos ?? 0} variant="yellow" />
                        <Kpi icon="userPlus" titulo="Novos membros" valor={kpis.novosMembros ?? 0} variant="cyan" />
                        <Kpi icon="trending" titulo="Retenção" valor={`${kpis.retencao ?? 0}%`} variant="pink" />
                    </div>

                    <div className={`${espacamento} mt-2 px-6`}>
                        <GraficoEvolucaoMembros anoInicio={anoInicio} anoFim={anoFim} />
                    </div>

                    <div className={`${espacamento} mt-2 px-6`}>
                        <GraficoDistribuicaoMembros anoInicio={anoInicio} anoFim={anoFim} />
                    </div>
                </>
            )}

            {activeTab === "ministerios" && (
                <>
                    <div className={`${espacamento} mt-2 px-6 grid grid-cols-1 gap-4 md:grid-cols-3`}>
                        <Kpi icon="church" titulo="Ministérios ativos" valor={kpis.totalMinisterios ?? 0} variant="cyan" />
                        <Kpi icon="trending" titulo="Média de membros" valor={kpis.totalMembroMinisterio ?? 0} variant="green" />
                        <Kpi icon="award" titulo="Mais engajado" valor={kpis.ministerioEngajado ?? "-"} variant="yellow" />
                    </div>

                    <div className={`${espacamento} mt-2 px-6 grid grid-cols-1 gap-4 xl:grid-cols-2`}>
                        <GraficoMembrosPorMinisterios anoInicio={anoInicio} anoFim={anoFim} />
                        <GraficoEventosPorMinisterio anoInicio={anoInicio} anoFim={anoFim} />
                    </div>

                    <div className={`${espacamento} mt-2 px-6`}>
                        <GraficoEvolucaoMembrosMinisterio anoInicio={anoInicio} anoFim={anoFim} />
                    </div>
                </>
            )}
        </div>
    );
}