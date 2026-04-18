import { useEffect, useState } from "react";
import { Kpi } from "../../molecules/ICF/Kpi";
import GraficoEvolucaoMembros from "../../atoms/ICF/GraficoEvolucaoMembros";
import GraficoDistribuicaoMembros from "../../atoms/ICF/GraficoDistribuicaoMembros";
import { GraficoEvolucaoMembrosMinisterio } from "../../atoms/ICF/GraficoEvolucaoMembrosMinisterios";
import { GraficoMembrosPorMinisterios } from "../../atoms/ICF/GraficoMembrosPorMinisterios";
import { GraficoEventosPorMinisterio } from "../../atoms/ICF/GraficoEventosPorMinisterios";
import GraficoGeneroMembros from "../../atoms/ICF/GraficoGeneroMembros";
import GraficoFaixaEtariaMembros from "../../atoms/ICF/GraficoFaixaEtariaMembros";
import TabelaAniversariantesMembros from "../../atoms/ICF/TabelaAniversariantesMembros";
import GraficoEvolucaoMinisterio from "../../atoms/ICF/GraficoEvolucaoMinisterio";
import { GraficoEventosPorMinisterioHorizontal } from "../../atoms/ICF/GraficoEventosPorMinisterioHorizontal";
import GraficoEngajamento from "../../atoms/ICF/GraficoEngajamento";
import GraficoEngajamentoPorMinisterio from "../../atoms/ICF/GraficoEngajamentoPorMinisterio";
import TabelaMembrosDesengajados from "../../atoms/ICF/TabelaMembrosDesengajados";
import { getKpisMembros, getKpisMinisterios, getKpisEngajamento } from "../../../services/dashboards";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const tabs = [
    { id: "membros", label: "Membros" },
    { id: "ministerios", label: "Ministérios" },
    { id: "engajamento", label: "Engajamento" },
];

const anoAtual = new Date().getFullYear();
const anos = Array.from({ length: 4 }, (_, i) => anoAtual - i);

export function Dashboard() {
    const [activeTab, setActiveTab] = useState("membros");
    const [kpis, setKpis] = useState({});
    const [anoInicio, setAnoInicio] = useState(String(anoAtual));

    useEffect(() => {
        async function carregar() {
            try {
                if (activeTab === "membros") {
                    const res = await getKpisMembros(anoInicio, anoAtual);
                    setKpis({
                        membrosAtivos: res.membrosAtivos,
                        novosMembros: res.membrosNovos,
                        retencao: res.retencao,
                    });
                } else if (activeTab === "ministerios") {
                    const res = await getKpisMinisterios(anoInicio, anoAtual);
                    setKpis({
                        totalMinisterios: res?.ministerioKpisResponseDTO?.ministeriosAtivos,
                        totalMembroMinisterio: res?.ministerioKpisResponseDTO?.mediaMembrosMinisterio,
                        ministerioEngajado: res?.eventoKpiDTO?.nomeMinisterio,
                    });
                } else if (activeTab === "engajamento") {
                    const res = await getKpisEngajamento(anoInicio, anoAtual);
                    setKpis({
                        mediaParticipacoes: res?.mediaParticipacoesMes || res?.participacoesMes,
                        engajamentoPercentual: res?.engajamentoPercentual || res?.percentualEngajamento,
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar KPIs:", err);
            }
        }
        carregar();
    }, [activeTab, anoInicio]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-8">
                    <h1 className="font-bold text-xl text-icf-primary-400 uppercase tracking-tight">
                        Dashboard
                    </h1>

                    <div className="flex">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setKpis({}); }}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium border transition-colors",
                                    index === 0 && "rounded-l-lg",
                                    index === tabs.length - 1 && "rounded-r-lg",
                                    index !== 0 && "-ml-px",
                                    activeTab === tab.id
                                        ? "bg-icf-primary-400 text-white border-icf-primary-400 z-10"
                                        : "bg-white text-icf-primary-400 border-icf-primary-200 hover:bg-icf-primary-50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-icf-primary-300" />
                    <Select value={anoInicio} onValueChange={setAnoInicio}>
                        <SelectTrigger className="w-24 bg-white border-icf-primary-100 h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {anos.map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAnoInicio(String(anoAtual))}
                        className="text-icf-primary-300 hover:text-icf-primary-400"
                    >
                        Limpar filtros
                    </Button>
                </div>
            </div>

            {/* Membros */}
            {activeTab === "membros" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Kpi icon="users" titulo="Membros ativos" valor={kpis.membrosAtivos} variant="yellow" />
                        <Kpi icon="userPlus" titulo="Novos Membros" valor={kpis.novosMembros} variant="cyan" />
                        <Kpi icon="trending" titulo="Retenção" valor={kpis.retencao != null ? `${kpis.retencao}%` : undefined} variant="pink" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <GraficoEvolucaoMembros anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TabelaAniversariantesMembros />
                        <div className="grid grid-cols-2 gap-4">
                            <GraficoGeneroMembros anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                            <GraficoFaixaEtariaMembros anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                        </div>
                    </div>
                </>
            )}

            {/* Ministérios */}
            {activeTab === "ministerios" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Kpi icon="church" titulo="Ministérios ativos" valor={kpis.totalMinisterios} variant="cyan" />
                        <Kpi icon="trending" titulo="Média de membros" valor={kpis.totalMembroMinisterio} variant="green" />
                        <Kpi icon="award" titulo="Mais engajado" valor={kpis.ministerioEngajado} variant="yellow" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <GraficoEvolucaoMinisterio anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <GraficoMembrosPorMinisterios anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                        <GraficoEventosPorMinisterioHorizontal anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                    </div>
                </>
            )}

            {/* Engajamento */}
            {activeTab === "engajamento" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Kpi icon="trending" titulo="Mediana de Participações/Mês" valor={kpis.mediaParticipacoes} variant="cyan" />
                        <Kpi icon="award" titulo="Engajamento %" valor={kpis.engajamentoPercentual != null ? `${kpis.engajamentoPercentual}%` : undefined} variant="green" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <GraficoEngajamento anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                            <GraficoEngajamentoPorMinisterio anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                        </div>
                        <TabelaMembrosDesengajados anoInicio={Number(anoInicio)} anoFim={anoAtual} limitePercentual={50} />
                    </div>
                </>
            )}
        </div>
    );
}
