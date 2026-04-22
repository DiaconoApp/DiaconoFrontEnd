import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { getQtdMembrosMinisterios } from "../../../services/dashboards";

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
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-white">Membros por ministério</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={dados} 
          margin={{ top: 10, right: 10, bottom: 40, left: 0 }}
        >
          <XAxis 
            dataKey="nome"
            tick={{ fontSize: 11, fill: '#a1a1aa' }}
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
            tick={{ fontSize: 11, fill: '#a1a1aa' }}
          />

          <Tooltip 
            formatter={(v) => [`${v} membros`, "Quantidade"]}
            contentStyle={{ 
              backgroundColor: '#09090b', 
              border: '1px solid #27272a',
              borderRadius: '8px',
              color: '#fff'
            }}
          />

          <Bar dataKey="qtd" radius={[4, 4, 0, 0]} fill="#e5e7eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
