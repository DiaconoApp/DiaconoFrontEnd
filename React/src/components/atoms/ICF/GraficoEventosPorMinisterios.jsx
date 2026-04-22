import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { getQtdEventosMinisterios } from "../../../services/dashboards";

export function GraficoEventosPorMinisterio({ anoInicio, anoFim }) {
  const [dados, setDados] = useState([]);
  const cores = ["#0D5E7D", "#0F7A99", "#1B7F8F", "#2E9EA8", "#3FB5A0", "#4CA77F", "#7BA85A", "#6FA391"];

  const corPorNome = (nome) => {
    const texto = String(nome ?? "");
    const hash = texto.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return cores[hash % cores.length];
  };

  useEffect(() => {
    async function carregar() {
      try {
        const res = await getQtdEventosMinisterios(anoInicio, anoFim);

        // Formata os dados para o Recharts
        const formatado = res.map((item) => ({
          nome: item.nomeMinisterio,
          qtd: item.quantidadeEventos,
        }));

        setDados(formatado);
      } catch (e) {
        console.error("Erro ao carregar gráfico de eventos:", e);
      }
    }

    carregar();
  }, [anoInicio, anoFim]);

  return (
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="font-semibold text-icf-primary-400">Eventos por ministério</h2>
        <p className="text-sm text-icf-primary-300">Volume de eventos por ministério no período selecionado</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={dados} 
          margin={{ top: 10, right: 10, bottom: 40, left: 0 }}
        >
          <XAxis 
            dataKey="nome"
            tick={{ fontSize: 11, fill: '#595959' }}
            interval={0}
            angle={-20}
            textAnchor="end"
            axisLine={false}
            tickLine={false}
          />

          <YAxis 
            allowDecimals={false} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#595959' }}
          />

          <Tooltip 
            formatter={(v) => [`${v} eventos`, "Quantidade"]}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#1C1C1C'
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
  );
}
