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
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold text-white">Evolução de membros</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={dadosTratados} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="mes" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#09090b', 
              border: '1px solid #27272a',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          {Array.from({ length: anoFim - anoInicio + 1 }).map((_, i) => {
            const ano = anoInicio + i;
            return (
              <Line
                key={ano}
                type="monotone"
                dataKey={ano}
                strokeWidth={2}
                stroke="#e5e7eb"
                dot={{ r: 4, fill: '#09090b', stroke: '#e5e7eb', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ffffff' }}
                name={`${ano}`}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
