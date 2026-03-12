import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

// Dados mock para o gráfico - substituir por dados reais da API
const dadosDistribuicao = [
  { name: "Membros", value: 8 },
  { name: "Congregados", value: 2 },
  { name: "Visitantes", value: 2 },
];

const cores = ["#1f2937", "#6b7280", "#d1d5db"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const radius = outerRadius * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14}>
      {value}
    </text>
  );
};

export default function GraficoDistribuicaoMembros({ anoInicio, anoFim }) {
  const [dados, setDados] = useState(dadosDistribuicao);

  useEffect(() => {
    // TODO: Implementar chamada à API para buscar dados reais
    // async function carregarDados() {
    //   try {
    //     const res = await getDistribuicaoMembros(anoInicio, anoFim);
    //     setDados(res);
    //   } catch (e) {
    //     console.error("Erro ao carregar distribuição:", e);
    //   }
    // }
    // carregarDados();
  }, [anoInicio, anoFim]);
      
  return (
    <div className="bg-white shadow-sm p-5 rounded-xl">
      <h2 className="font-semibold text-icf-primary-400 mb-4">Distribuição de Membros</h2>

      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
            >
              {dados.map((_, i) => (
                <Cell key={i} fill={cores[i % cores.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-6 mt-4">
        {dados.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: cores[i % cores.length] }}
            />
            <span className="text-sm text-icf-primary-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
