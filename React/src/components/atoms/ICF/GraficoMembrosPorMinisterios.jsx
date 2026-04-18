import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { getQtdMembrosMinisterios } from "../../../services/dashboards";

const coresVerdes = ['#10b981', '#059669', '#047857', '#065f46', '#0a5f45', '#064e40', '#063d35', '#022d27'];

export function GraficoMembrosPorMinisterios({ anoInicio, anoFim }) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await getQtdMembrosMinisterios(anoInicio, anoFim);

        const formatado = res.map((item) => ({
          nome: item.name,
          qtd: item.quantidadeMembros,
        }));

        setDados(formatado);
      } catch (e) {
        console.error("Erro ao carregar gráfico de ministérios:", e);
      }
    }

    carregar();
  }, [ anoInicio, anoFim ]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-semibold text-icf-primary-400 mb-4">Membros por Ministério</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={dados} 
          margin={{ top: 10, right: 10, bottom: 40, left: 0 }}
        >
          <XAxis 
            dataKey="nome"
            tick={{ fontSize: 11, fill: '#6b7280' }}
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
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />

          <Tooltip 
            formatter={(v) => [`${v} membros`, "Quantidade"]}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />

          <Bar dataKey="qtd" radius={[4, 4, 0, 0]}>
            {dados.map((_, index) => (
              <Cell key={`cell-${index}`} fill={coresVerdes[index % coresVerdes.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
