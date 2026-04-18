import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { getEvolucaoEngajamento } from "../../../services/dashboards";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function transformarParaLinha(dados, anoInicio, anoFim) {
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
      // Assuming the data has a 'engajamentoPercentual' or similar field
      estrutura[mesIndex][ano] = item.percentualEngajamento || item.engajamento || 0;
    }
  });

  return estrutura;
}

export default function GraficoEngajamento({ anoInicio, anoFim }) {
  const [dadosTratados, setDadosTratados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const bruto = await getEvolucaoEngajamento(anoInicio, anoFim);
        const formatado = transformarParaLinha(bruto, anoInicio, anoFim);
        setDadosTratados(formatado);
      } catch (e) {
        console.error("Erro ao carregar evolução de engajamento:", e);
        setDadosTratados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [anoInicio, anoFim]);

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl h-full flex flex-col">
      <h2 className="font-semibold text-icf-primary-400 mb-4">Engajamento %</h2>

      {carregando ? (
        <div className="flex items-center justify-center flex-1 text-icf-primary-300">
          Carregando...
        </div>
      ) : (
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
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{ value: 'Mediana/Membro', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: '11px' } }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, "Engajamento"]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            {/* Renderiza linhas para cada ano */}
            {Array.from({ length: anoFim - anoInicio + 1 }, (_, i) => anoInicio + i).map((ano, idx) => {
              const cores = ['#10b981', '#059669', '#047857', '#065f46'];
              return (
                <Line 
                  key={ano}
                  type="monotone" 
                  dataKey={String(ano)} 
                  stroke={cores[idx % cores.length]}
                  strokeWidth={2}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
