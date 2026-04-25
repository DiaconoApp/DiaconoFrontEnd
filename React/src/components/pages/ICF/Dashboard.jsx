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

const anosDisponiveis = (anoAtual) =>
    Array.from({ length: 5 }, (_, i) => anoAtual - i);

export function Dashboard() {
    const [activeTab, setActiveTab] = useState("membros");
    const [kpis, setKpis] = useState({});
    const anoAtual = new Date().getFullYear();
    const [anoInicio, setAnoInicio] = useState(anoAtual - 4);
    const [anoFim, setAnoFim] = useState(anoAtual);

    useEffect(() => {
        async function carregar() {
            try {
                if (activeTab === "membros") {
                    const res = await getKpisMembros(anoInicio, anoFim);
                    setKpis({
                        membrosAtivos: res.membrosAtivos,
                        novosMembros: res.membrosNovos,
                        retencao: res.retencao,
                    });
                } else {
                    const res = await getKpisMinisterios(anoInicio, anoFim);
                    setKpis({
                        totalMinisterios: res?.ministerioKpisResponseDTO?.ministeriosAtivos,
                        totalMembroMinisterio: res?.ministerioKpisResponseDTO?.mediaMembrosMinisterio,
                        ministerioEngajado: res?.eventoKpiDTO?.nomeMinisterio,
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar KPIs:", err);
            }
        }
        carregar();
    }, [activeTab, anoInicio, anoFim]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <PageHeader
                titulo="Dashboard"
                descricao="Visão consolidada dos indicadores"
            />

            {/* Controles: abas + filtros de período */}
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                {/* Abas */}
                <div className="flex rounded-lg border border-icf-primary-100 bg-icf-primary-50 p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 rounded-md px-5 py-2 text-sm font-medium transition-colors sm:flex-none ${
                                activeTab === tab.id
                                    ? "bg-icf-primary-400 text-white shadow-sm"
                                    : "text-icf-primary-300 hover:bg-white hover:text-icf-primary-400"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Seletores de período */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-icf-primary-300">
                            Ano inicial
                        </label>
                        <select
                            value={anoInicio}
                            onChange={(e) => setAnoInicio(Number(e.target.value))}
                            className="rounded-lg border border-icf-primary-100 bg-white px-3 py-2 text-sm font-medium text-icf-primary-400 outline-none transition-colors focus:border-icf-primary-200"
                        >
                            {anosDisponiveis(anoAtual).map((ano) => (
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
                            className="rounded-lg border border-icf-primary-100 bg-white px-3 py-2 text-sm font-medium text-icf-primary-400 outline-none transition-colors focus:border-icf-primary-200"
                        >
                            {anosDisponiveis(anoAtual).map((ano) => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Aba Membros */}
            {activeTab === "membros" && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Kpi icon="users" titulo="Membros ativos" valor={kpis.membrosAtivos ?? 0} variant="yellow" />
                        <Kpi icon="userPlus" titulo="Novos membros" valor={kpis.novosMembros ?? 0} variant="cyan" />
                        <Kpi icon="trending" titulo="Retenção" valor={`${Math.round(kpis.retencao ?? 0)}%`} variant="pink" />
                    </div>

                    <GraficoEvolucaoMembros anoInicio={anoInicio} anoFim={anoFim} />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <TabelaAniversariantesMembros />
                        <GraficoDistribuicaoMembros anoInicio={anoInicio} anoFim={anoFim} />
                    </div>
                </>
            )}

            {/* Aba Ministérios */}
            {activeTab === "ministerios" && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Kpi icon="church" titulo="Ministérios ativos" valor={kpis.totalMinisterios ?? 0} variant="cyan" />
                        <Kpi
                            icon="trending"
                            titulo="Média de membros"
                            valor={kpis.totalMembroMinisterio != null ? Number(kpis.totalMembroMinisterio).toFixed(1) : 0}
                            variant="green"
                        />
                        <Kpi icon="award" titulo="Mais engajado" valor={kpis.ministerioEngajado ?? "-"} variant="yellow" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <GraficoMembrosPorMinisterios anoInicio={anoInicio} anoFim={anoFim} />
                        <GraficoEventosPorMinisterio anoInicio={anoInicio} anoFim={anoFim} />
                    </div>

                    <GraficoEvolucaoMembrosMinisterio anoInicio={anoInicio} anoFim={anoFim} />
                </>
            )}
        </div>
    );
}
