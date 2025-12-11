import { Menu } from "../../templates/ICF/Menu";
import { TituloPagina } from "../../atoms/ICF/TituloPagina";
import { useEffect, useState } from "react";
import { Kpi } from "../../molecules/ICF/Kpi";
import { MenuHeaderDashboards } from "../../atoms/ICF/MenuHeaderDashboards";
import { FiltrosDashboards } from "../../atoms/ICF/FiltrosDashboards";
import GraficoEvolucaoMembros from "../../atoms/ICF/GraficoEvolucaoMembros";
import GraficoDistribuicaoMembros from "../../atoms/ICF/GraficoDistribuicaoMembros";
import TabelaAniversariantes from "../../atoms/ICF/TabelaAniversariantesMembros";
import { GraficoEvolucaoMembrosMinisterio } from "../../atoms/ICF/GraficoEvolucaoMembrosMinisterios";
import { GraficoMembrosPorMinisterios } from "../../atoms/ICF/GraficoMembrosPorMinisterios";
import { GraficoEventosPorMinisterio } from "../../atoms/ICF/GraficoEventosPorMinisterios";
import { getKpisMembros, getKpisMinisterios } from "../../../services/dashboards";

export function Dashboard() {
    const [menuAberto, setMenuAberto] = useState(true);
    const [activeTab, setActiveTab] = useState("membros");
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";

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
                        totalMinisterios: res?.ministerioKpisResponseDTO.ministeriosAtivos,
                        totalMembroMinisterio: res?.ministerioKpisResponseDTO.mediaMembrosMinisterio,
                        ministerioEngajado: res?.eventoKpiDTO.nomeMinisterio

                    });
                }
            } catch (err) {
                console.error("Erro ao carregar KPIs:", err);
            }
        }

        carregar();
    }, [activeTab, anoInicio, anoFim]);

    return (
        <div className='bg-[#F6F7F9] flex flex-col h-full w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300
            ${espacamento}`}>
                <TituloPagina titulo="Dashboards" />
            </div>
            <div className={`${espacamento} px-6 flex justify-between`}>
                <MenuHeaderDashboards activeTab={activeTab} onChangeTab={setActiveTab} />
                <FiltrosDashboards
                    anoInicio={anoInicio}
                    setAnoInicio={setAnoInicio}
                    anoFim={anoFim}
                    setAnoFim={setAnoFim}
                />
            </div>

            {/* ================================
    DASHBOARD — MEMBROS
================================ */}
            {activeTab === "membros" && (
                <>
                    <div className={`${espacamento} mt-4 px-6 grid grid-cols-3 gap-4`}>
                        <Kpi icone="iconeGrupo" titulo="Membros ativos" valor={kpis.membrosAtivos} />
                        <Kpi icone="iconeGrupo" titulo="Novos membros" valor={kpis.novosMembros} />
                        <Kpi icone="iconeGrupo" titulo="Retenção" valor={`${kpis.retencao}%`} />
                    </div>

                    <div className={`${espacamento} mt-4 px-6`}>
                        <GraficoEvolucaoMembros
                            anoInicio={anoInicio}
                            anoFim={anoFim}
                        />
                    </div>

                    <div className={`${espacamento} mt-4 px-6 gap-4`}>
                        <GraficoDistribuicaoMembros
                            anoInicio={anoInicio}
                            anoFim={anoFim}
                        />
                        {/* <TabelaAniversariantes /> */}
                    </div>
                </>
            )}

            {/* ================================
    DASHBOARD — MINISTÉRIOS
================================ */}
            {activeTab === "ministerios" && (
                <>
                    <div className={`${espacamento} mt-4 px-6 grid grid-cols-3 gap-4`}>
                        <Kpi icone="iconeTerra" titulo="Ministérios Ativos" valor={kpis.totalMinisterios} />
                        <Kpi icone="iconeTerra" titulo="Média de membros por ministério" valor={kpis.totalMembroMinisterio} />
                        <Kpi icone="iconeTerra" titulo="Ministério mais engajado" valor={kpis.ministerioEngajado} />
                    </div>

                    <div className={`${espacamento} mt-4 px-6`}>
                        <GraficoEvolucaoMembrosMinisterio
                            anoInicio={anoInicio}
                            anoFim={anoFim}
                        />
                    </div>

                    <div className={`${espacamento} mt-4 px-6 grid grid-cols-2 gap-4`}>
                        <GraficoMembrosPorMinisterios
                            anoInicio={anoInicio}
                            anoFim={anoFim}
                        />
                        <GraficoEventosPorMinisterio
                            anoInicio={anoInicio}
                            anoFim={anoFim}
                        />
                    </div>
                </>
            )}

        </div>
    );
}