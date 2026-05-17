import { useEffect, useState } from "react";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import { Kpi } from "../../molecules/ICF/Kpi";
import TabelaAniversariantesMembros from "../../atoms/ICF/TabelaAniversariantesMembros";
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

    return (
        <div className="min-h-screen bg-background text-icf-primary-400 pb-8">
            <div className="flex flex-col gap-6 px-6 py-6">
                <PageHeader
                    titulo="Dashboard"
                    descricao="Visão consolidada dos indicadores"
                />

                <div className="flex flex-col gap-4 rounded-xl border border-icf-primary-50 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div className="inline-flex rounded-lg border border-icf-primary-100 bg-icf-primary-50 p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-icf-primary-400 text-white shadow-sm" : "text-icf-primary-300 hover:bg-white hover:text-icf-primary-400"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-icf-primary-300">
                                Ano inicial
                            </label>
                            <select
                                value={anoInicio}
                                onChange={(e) => setAnoInicio(Number(e.target.value))}
                                className="min-w-28 rounded-lg border border-icf-primary-100 bg-white px-3 py-2 text-sm font-medium text-icf-primary-400 outline-none transition-colors focus:border-icf-primary-200"
                            >
                                {Array.from({ length: 5 }, (_, i) => anoAtual - i).map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-icf-primary-300">
                                Ano final
                            </label>
                            <select
                                value={anoFim}
                                onChange={(e) => setAnoFim(Number(e.target.value))}
                                className="min-w-28 rounded-lg border border-icf-primary-100 bg-white px-3 py-2 text-sm font-medium text-icf-primary-400 outline-none transition-colors focus:border-icf-primary-200"
                            >
                                {Array.from({ length: 5 }, (_, i) => anoAtual - i).map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {activeTab === "membros" && (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Kpi icon="users" titulo="Membros ativos" valor={kpis.membrosAtivos ?? 0} variant="yellow" />
                            <Kpi icon="userPlus" titulo="Novos membros" valor={kpis.novosMembros ?? 0} variant="cyan" />
                            <Kpi icon="trending" titulo="Retenção" valor={`${kpis.retencao ?? 0}%`} variant="pink" />
                        </div>

                        <GraficoEvolucaoMembros anoInicio={anoInicio} anoFim={anoFim} />

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <TabelaAniversariantesMembros />
                            <GraficoDistribuicaoMembros anoInicio={anoInicio} anoFim={anoFim} />
                        </div>
                    </>
                )}

                {activeTab === "ministerios" && (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Kpi icon="church" titulo="Ministérios ativos" valor={kpis.totalMinisterios ?? 0} variant="cyan" />
                            <Kpi icon="trending" titulo="Média de membros" valor={kpis.totalMembroMinisterio ?? 0} variant="green" />
                            <Kpi icon="award" titulo="Mais engajado" valor={kpis.ministerioEngajado ?? "-"} variant="yellow" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <GraficoMembrosPorMinisterios anoInicio={anoInicio} anoFim={anoFim} />
                            <GraficoEventosPorMinisterio anoInicio={anoInicio} anoFim={anoFim} />
                        </div>

                        <GraficoEvolucaoMembrosMinisterio anoInicio={anoInicio} anoFim={anoFim} />
                    </>
                )}
            </div>
        </div>
    );
}