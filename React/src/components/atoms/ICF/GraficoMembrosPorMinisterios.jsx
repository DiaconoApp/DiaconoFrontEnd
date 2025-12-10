import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { useState, useEffect } from "react";
import { getQtdMembrosMinisterios } from "../../../services/dashboards";

const cores = [
  "#A3D9A5",
  "#80C47C",
  "#5FAF59",
  "#4A9B48",
  "#3C893C",
  "#2F7731",
  "#25662A",
  "#1D5523",
];

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
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Membros por ministério</h2>

      <ResponsiveContainer width="100%" height={330}>
        <BarChart 
          data={dados} 
          margin={{ top: 20, right: 10, bottom: 50, left: 10 }}
        >
          <XAxis 
            dataKey="nome"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />

          <YAxis allowDecimals={false} />

          <Tooltip formatter={(v) => [`${v} membros`, "Quantidade"]} />

          <Bar dataKey="qtd" radius={[6, 6, 0, 0]}>
            {dados.map((_, i) => (
              <Cell key={i} fill={cores[i % cores.length]} />
            ))}

            <LabelList 
              dataKey="qtd" 
              position="top"
              style={{ fill: "#333", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
