import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

// const dados = [
//   { nome: "Recepção", qtd: 30 },
//   { nome: "Crianças", qtd: 45 },
//   { nome: "Mídia", qtd: 70 },
//   { nome: "Jovens", qtd: 120 },
//   { nome: "Louvor", qtd: 110 },
// ];

import { useState, useEffect } from "react";
import { getQtdEventosMinisterios } from "../../../services/dashboards";

const cores = ["#C8F1C8", "#A4E3A6", "#7ED786", "#53C260", "#2E9E35"];

export function GraficoEventosPorMinisterio({ anoInicio, anoFim }) {
  const [dados, setDados] = useState([]);

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
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Eventos por Ministério</h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={dados} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="nome" type="category" width={100} />
          <Tooltip formatter={(v) => [`${v} eventos`, "Quantidade"]} />

          <Bar dataKey="qtd">
            {dados.map((_, i) => (
              <Cell key={i} fill={cores[i  % cores.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
