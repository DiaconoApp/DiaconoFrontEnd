import { useEffect, useState } from "react";
import { Kpi } from "../../molecules/ICF/Kpi";
import GraficoEvolucaoMembros from "../../atoms/ICF/GraficoEvolucaoMembros";
import GraficoDistribuicaoMembros from "../../atoms/ICF/GraficoDistribuicaoMembros";
import { GraficoEvolucaoMembrosMinisterio } from "../../atoms/ICF/GraficoEvolucaoMembrosMinisterios";
import { GraficoMembrosPorMinisterios } from "../../atoms/ICF/GraficoMembrosPorMinisterios";
import { GraficoEventosPorMinisterio } from "../../atoms/ICF/GraficoEventosPorMinisterios";
import { getKpisMembros, getKpisMinisterios } from "../../../services/dashboards";
import { Filter, Cake, User } from "lucide-react";
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
];

export function Dashboard() {
    const [activeTab, setActiveTab] = useState("membros");

    const [kpis, setKpis] = useState({});
    const anoAtual = new Date().getFullYear();

    const [anoInicio, setAnoInicio] = useState(String(anoAtual));
    const [projeto, setProjeto] = useState("todos");

    useEffect(() => {
        async function carregar() {
            try {
                if (activeTab === "membros") {
                    const res = await getKpisMembros(anoInicio, anoAtual);
                    setKpis({
                        membrosAtivos: res.membrosAtivos,
                        novosMembros: res.membrosNovos,
                        retencao: res.retencao
                    });
                } else if (activeTab === "ministerios") {
                    const res = await getKpisMinisterios(anoInicio, anoAtual);
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
    }, [activeTab, anoInicio]);

    const limparFiltros = () => {
        setAnoInicio(String(anoAtual));
        setProjeto("todos");
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-8">
                    <h1 className="font-bold text-xl text-icf-primary-400 uppercase tracking-tight">
                        Dashboard
                    </h1>
                    
                    {/* Tabs */}
                    <div className="flex">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-icf-primary-300" />
                    
                    <Select value={anoInicio} onValueChange={setAnoInicio}>
                        <SelectTrigger className="w-24 bg-white border-icf-primary-100 h-9">
                            <SelectValue placeholder={anoAtual} />
                        </SelectTrigger>
                        <SelectContent>
                            {[2024, 2025, 2026, 2027].map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={projeto} onValueChange={setProjeto}>
                        <SelectTrigger className="w-32 bg-white border-icf-primary-100 h-9">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={limparFiltros}
                        className="text-icf-primary-300 hover:text-icf-primary-400"
                    >
                        Limpar filtros
                    </Button>
                </div>
            </div>

            {/* Dashboard - Membros */}
            {activeTab === "membros" && (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Kpi icon="users" titulo="Membros ativos" valor={kpis.membrosAtivos} variant="yellow" />
                        <Kpi icon="userPlus" titulo="Novos Membros" valor={kpis.novosMembros} variant="cyan" />
                        <Kpi icon="trending" titulo="Retenção" valor={`${kpis.retencao || 0}%`} variant="pink" />
                    </div>

                    {/* Gráficos lado a lado */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <GraficoEvolucaoMembros anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                        <GraficoDistribuicaoMembros anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                    </div>

                    {/* Aniversariantes e Membros por Ministério */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Aniversariantes do Mês */}
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Cake className="w-5 h-5 text-icf-primary-300" />
                                <h3 className="font-semibold text-icf-primary-400">Aniversariantes do Mês</h3>
                            </div>
                            <div className="space-y-2">
                                {/* Mock data - substituir por dados reais */}
                                {[
                                    { nome: "João Silva Santos", dia: 18 },
                                    { nome: "Maria Oliveira Costa", dia: 3 },
                                    { nome: "Pedro Almeida Ferreira", dia: 7 },
                                    { nome: "Ana Paula Rodrigues", dia: 10 },
                                    { nome: "Carlos Eduardo Lima", dia: 25 },
                                ].map((pessoa, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-icf-primary-50">
                                        <div className="w-10 h-10 rounded-full bg-icf-primary-100 flex items-center justify-center">
                                            <Cake className="w-5 h-5 text-icf-primary-300" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-icf-primary-400">{pessoa.nome}</p>
                                            <p className="text-xs text-icf-primary-200">Dia {pessoa.dia}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Membros por Ministério - Horizontal Bar */}
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h3 className="font-semibold text-icf-primary-400 mb-4">Membros por Ministério</h3>
                            <div className="space-y-3">
                                {/* Mock data - substituir por dados reais */}
                                {[
                                    { nome: "Diaconato", valor: 65, max: 20 },
                                    { nome: "Louvor", valor: 50, max: 20 },
                                    { nome: "Infantil", valor: 35, max: 20 },
                                    { nome: "Interces", valor: 75, max: 20 },
                                    { nome: "Mídia", valor: 30, max: 20 },
                                    { nome: "Jovens", valor: 100, max: 20 },
                                ].map((min, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm text-icf-primary-300 w-16 text-right">{min.nome}</span>
                                        <div className="flex-1 h-5 bg-icf-primary-50 rounded">
                                            <div 
                                                className="h-full bg-icf-primary-400 rounded"
                                                style={{ width: `${min.valor}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Dashboard - Ministérios */}
            {activeTab === "ministerios" && (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Kpi icon="church" titulo="Ministérios ativos" valor={kpis.totalMinisterios} variant="cyan" />
                        <Kpi icon="trending" titulo="Média de membros" valor={kpis.totalMembroMinisterio} variant="green" />
                        <Kpi icon="award" titulo="Mais engajado" valor={kpis.ministerioEngajado} variant="yellow" />
                    </div>

                    {/* Gráficos lado a lado - Membros e Eventos por Ministério */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <GraficoMembrosPorMinisterios anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                        <GraficoEventosPorMinisterio anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                    </div>

                    {/* Engajamento e Evolução */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Engajamento por Ministério - Horizontal Bar */}
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h3 className="font-semibold text-icf-primary-400 mb-4">Engajamento por Ministério</h3>
                            <div className="space-y-3">
                                {/* Mock data - substituir por dados reais */}
                                {[
                                    { nome: "Louvor", valor: 85 },
                                    { nome: "Diaconato", valor: 75 },
                                    { nome: "Jovens", valor: 90 },
                                    { nome: "Infantil", valor: 60 },
                                ].map((min, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 w-20 text-right">{min.nome}</span>
                                        <div className="flex-1 h-6 bg-gray-100 rounded">
                                            <div 
                                                className="h-full bg-gray-500 rounded"
                                                style={{ width: `${min.valor}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <GraficoEvolucaoMembrosMinisterio anoInicio={Number(anoInicio)} anoFim={anoAtual} />
                    </div>
                </>
            )}
        </div>
    );
}