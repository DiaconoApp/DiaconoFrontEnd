import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { getEvolucaoMembros } from "../../../services/dashboards";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function transformarParaMultiLinha(dados, anoInicio, anoFim) {
  const estrutura = MESES.map(m => ({ mes: m }));

  // Inicializa todas as colunas por ano
  for (let ano = anoInicio; ano <= anoFim; ano++) {
    estrutura.forEach(item => (item[ano] = 0));
  }

  dados.forEach(item => {
    const data = new Date(item.data);
    const ano = data.getFullYear();

    if (ano >= anoInicio && ano <= anoFim) {
      const mesIndex = data.getMonth();
      estrutura[mesIndex][ano] += item.quantidade;
    }
  });

  return estrutura;
}

export default function GraficoEvolucaoMembros({ anoInicio, anoFim }) {

  const [dadosTratados, setDadosTratados] = useState([]);
  const cores = ["#0D5E7D", "#1B7F8F", "#2E9EA8", "#4CA77F", "#7BA85A"];

  useEffect(() => {
    async function carregar() {
      try {
        const bruto = await getEvolucaoMembros(anoInicio, anoFim);
        const formatado = transformarParaMultiLinha(bruto, anoInicio, anoFim);
        setDadosTratados(formatado);
      } catch (e) {
        console.error("Erro ao carregar evolução:", e);
      }
    }

    carregar();
  }, [anoInicio, anoFim]);

  return (
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-icf-primary-400">Evolução de membros</h2>
          <p className="text-sm text-icf-primary-300">Comparativo mensal entre os anos selecionados</p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-icf-primary-200">
          {anoInicio} - {anoFim}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={dadosTratados} margin={{ top: 5, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} opacity={0.7} />
          <XAxis 
            dataKey="mes" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 13, fill: '#595959', fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 13, fill: '#595959', fontWeight: 500 }}
          />
          <Tooltip 
            cursor={{ stroke: '#0D2750', strokeWidth: 2, opacity: 0.3 }}
            labelStyle={{ color: '#1C1C1C', fontWeight: 700 }}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '2px solid #0D2750',
              borderRadius: '8px',
              color: '#1C1C1C',
              boxShadow: '0 4px 12px rgba(13, 39, 80, 0.15)'
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: 13, color: '#1C1C1C', fontWeight: 600, paddingBottom: 16 }}
          />
          {Array.from({ length: anoFim - anoInicio + 1 }).map((_, i) => {
            const ano = anoInicio + i;
            return (
              <Line
                key={ano}
                type="monotone"
                dataKey={ano}
                strokeWidth={3}
                stroke={cores[i % cores.length]}
                dot={false}
                isAnimationActive={true}
                activeDot={{ r: 6, fill: cores[i % cores.length], stroke: '#ffffff', strokeWidth: 3 }}
                name={`${ano}`}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
