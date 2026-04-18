import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { getEvolucaoMembros } from "../../../services/dashboards";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const coresVerdes = ['#10b981', '#059669', '#047857', '#065f46'];

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
    <div className="bg-white shadow-sm p-5 rounded-xl">
      <h2 className="font-semibold text-icf-primary-400 mb-4">Evolução de Membros</h2>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dadosTratados} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="mes" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          {Array.from({ length: anoFim - anoInicio + 1 }).map((_, i) => {
            const ano = anoInicio + i;
            return (
              <Line
                key={ano}
                type="monotone"
                dataKey={ano}
                strokeWidth={2}
                stroke={coresVerdes[i % coresVerdes.length]}
                dot={{ r: 4, fill: '#fff', stroke: coresVerdes[i % coresVerdes.length], strokeWidth: 2 }}
                activeDot={{ r: 6, fill: coresVerdes[i % coresVerdes.length] }}
                name={`${ano}`}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
