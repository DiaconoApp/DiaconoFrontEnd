import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { buscarTodosMinisterios } from "../../../services/ministerios";
import { getEvolucaoMinisterio } from "../../../services/dashboards";
import { useIsMobile } from "../../../hooks/use-mobile";

const mesesNome = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const cores = ["#0D5E7D", "#1B7F8F", "#2E9EA8", "#4CA77F", "#7BA85A", "#BAA045"];

export function GraficoEvolucaoMembrosMinisterio({ anoInicio, anoFim }) {
  const [ministerios, setMinisterios] = useState([]);
  const [idMinisterioSelecionado, setIdMinisterioSelecionado] = useState(null);
  const [dados, setDados] = useState([]);
  const isMobile = useIsMobile();

  const anos = Array.from({ length: anoFim - anoInicio + 1 }, (_, i) => anoInicio + i);

  useEffect(() => {
    async function carregarMinisterios() {
      const res = await buscarTodosMinisterios();
      if (Array.isArray(res) && res.length > 0) {
        setMinisterios(res);
        setIdMinisterioSelecionado(res[0].idExterno);
      }
    }
    carregarMinisterios();
  }, []);

  useEffect(() => {
    async function carregarEvolucao() {
      if (!idMinisterioSelecionado) return;
      try {
        const evo = await getEvolucaoMinisterio(idMinisterioSelecionado, anoInicio, anoFim);
        const estrutura = mesesNome.map((m) => ({ mes: m }));
        evo.forEach((item) => {
          const dataObj = new Date(item.data);
          const linha = estrutura.find((l) => l.mes === mesesNome[dataObj.getMonth()]);
          linha[dataObj.getFullYear()] = item.quantidadeMembros;
        });
        anos.forEach((ano) => {
          estrutura.forEach((linha) => {
            if (linha[ano] === undefined) linha[ano] = 0;
          });
        });
        setDados(estrutura);
      } catch (err) {
        console.error("Erro ao carregar evolução:", err);
      }
    }
    carregarEvolucao();
  }, [idMinisterioSelecionado, anoInicio, anoFim]);

  const tickStyle = { fontSize: isMobile ? 10 : 13, fill: "#595959", fontWeight: 500 };

  return (
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-icf-primary-400">Evolução de membros do ministério</h2>
          <p className="text-sm text-icf-primary-300">Comparativo mensal por ministério selecionado</p>
        </div>
        <select
          value={idMinisterioSelecionado || ""}
          onChange={(e) => setIdMinisterioSelecionado(e.target.value)}
          className="w-full rounded-lg border border-icf-primary-100 bg-white px-3 py-2 text-sm font-medium text-icf-primary-400 outline-none transition-colors focus:border-icf-primary-200 sm:w-auto sm:min-w-40"
        >
          {ministerios.map((m) => (
            <option key={m.idExterno} value={m.idExterno}>{m.nome}</option>
          ))}
        </select>
      </div>

      <div className="h-[220px] sm:h-[300px] lg:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dados}
            margin={{ top: 5, right: isMobile ? 4 : 20, bottom: 10, left: isMobile ? -24 : 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.7} stroke="#E5E7EB" />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={tickStyle} />
            <YAxis axisLine={false} tickLine={false} tick={tickStyle} />
            <Tooltip
              cursor={{ stroke: "#0D2750", strokeWidth: 2, opacity: 0.3 }}
              labelStyle={{ color: "#1C1C1C", fontWeight: 700 }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "2px solid #0D2750",
                borderRadius: "8px",
                color: "#1C1C1C",
                boxShadow: "0 4px 12px rgba(13, 39, 80, 0.15)",
              }}
            />
            <Legend
              verticalAlign="top"
              align={isMobile ? "center" : "right"}
              wrapperStyle={{
                fontSize: isMobile ? 11 : 13,
                color: "#1C1C1C",
                fontWeight: 600,
                paddingBottom: 12,
              }}
            />
            {anos.map((ano, index) => (
              <Line
                key={ano}
                type="monotone"
                dataKey={ano}
                stroke={cores[index % cores.length]}
                strokeWidth={isMobile ? 2 : 3}
                dot={false}
                isAnimationActive={true}
                activeDot={{ r: 5, fill: cores[index % cores.length], stroke: "#ffffff", strokeWidth: 2 }}
                name={`${ano}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
