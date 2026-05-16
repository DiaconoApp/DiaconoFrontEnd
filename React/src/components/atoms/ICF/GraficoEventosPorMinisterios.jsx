import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { getQtdEventosMinisterios } from "../../../services/dashboards";
import { useIsMobile } from "../../../hooks/use-mobile";

const cores = ["#0D5E7D", "#0F7A99", "#1B7F8F", "#2E9EA8", "#3FB5A0", "#4CA77F", "#7BA85A", "#6FA391"];

function corPorNome(nome) {
  const hash = String(nome ?? "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return cores[hash % cores.length];
}

export function GraficoEventosPorMinisterio({ anoInicio, anoFim }) {
  const [dados, setDados] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function carregar() {
      try {
        const res = await getQtdEventosMinisterios(anoInicio, anoFim);
        setDados(res.map((item) => ({ nome: item.nomeMinisterio, qtd: item.quantidadeEventos })));
      } catch (e) {
        console.error("Erro ao carregar gráfico de eventos:", e);
      }
    }
    carregar();
  }, [anoInicio, anoFim]);

  const tickStyle = { fontSize: isMobile ? 10 : 11, fill: "#595959" };
  const minWidth = Math.max(isMobile ? 240 : 280, dados.length * (isMobile ? 48 : 60));

  return (
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-icf-primary-400">Eventos por ministério</h2>
        <p className="text-sm text-icf-primary-300">Volume de eventos por ministério no período selecionado</p>
      </div>

      <div className="overflow-x-auto">
        <div className="h-[200px] sm:h-[260px]" style={{ minWidth }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 10, right: 8, bottom: 36, left: isMobile ? -20 : 0 }}>
              <XAxis
                dataKey="nome"
                tick={tickStyle}
                interval={0}
                angle={-20}
                textAnchor="end"
                axisLine={false}
                tickLine={false}
              />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={tickStyle} />
              <Tooltip
                formatter={(v) => [`${v} eventos`, "Quantidade"]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#1C1C1C",
                }}
              />
              <Bar dataKey="qtd" radius={[4, 4, 0, 0]}>
                {dados.map((entry, index) => (
                  <Cell key={`cell-${entry.nome}-${index}`} fill={corPorNome(entry.nome)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
