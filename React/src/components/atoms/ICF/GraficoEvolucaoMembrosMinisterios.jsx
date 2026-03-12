import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { buscarTodosMinisterios } from "../../../services/ministerios";
import { getEvolucaoMinisterio } from "../../../services/dashboards";

export function GraficoEvolucaoMembrosMinisterio({ anoInicio, anoFim }) {
  const [ministerios, setMinisterios] = useState([]);
  const [idMinisterioSelecionado, setIdMinisterioSelecionado] = useState(null);
  const [dados, setDados] = useState([]);


   const anos = Array.from(
    { length: anoFim - anoInicio + 1 },
    (_, i) => anoInicio + i
  );
  const cores = ["#1f2937", "#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb"];

  const mesesNome = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  useEffect(() => {
    async function carregarMinisterios() {
       const res = await buscarTodosMinisterios();

      if (Array.isArray(res) && res.length > 0) {
        setMinisterios(res);

        // Carrega o primeiro ministério automaticamente
        setIdMinisterioSelecionado(res[0].idExterno);
      }
    }

    carregarMinisterios();
  }, []);

  // Buscar evolução
  useEffect(() => {
    async function carregarEvolucao() {
  if (!idMinisterioSelecionado) return;

  try {
    const evo = await getEvolucaoMinisterio(
      idMinisterioSelecionado,
      anoInicio,
      anoFim
    );

    // Estrutura base com todos os meses
    const estrutura = mesesNome.map((m) => ({ mes: m }));

    // Preencher meses recebidos da API
    evo.forEach((item) => {
      const dataObj = new Date(item.data);
      const ano = dataObj.getFullYear();
      const mesIndex = dataObj.getMonth();
      const mesNome = mesesNome[mesIndex];

      const linha = estrutura.find((l) => l.mes === mesNome);
      linha[ano] = item.quantidadeMembros;
    });

    // 🔥 Completa com 0 os meses sem valor
    anos.forEach((ano) => {
      estrutura.forEach((linha) => {
        if (linha[ano] === undefined) {
          linha[ano] = 0;
        }
      });
    });

    setDados(estrutura);
  } catch (err) {
    console.error("Erro ao carregar evolução:", err);
  }
}

    carregarEvolucao();
  }, [idMinisterioSelecionado, anoInicio, anoFim]);

  // Criar lista de anos do range
  // const anos = Array.from({ length: anoFim - anoInicio + 1 }, (_, i) => anoInicio + i);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-icf-primary-400">Evolução de Membros</h2>

        <select
          value={idMinisterioSelecionado || ""}
          onChange={(e) => setIdMinisterioSelecionado(e.target.value)}
          className="border border-gray-300 rounded-lg text-gray-500 bg-white px-3 py-1.5 text-sm"
        >
          {ministerios.map((m) => (
            <option key={m.idExterno} value={m.idExterno}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
          <XAxis 
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />

          {anos.map((ano, index) => (
            <Line
              key={ano}
              type="monotone"
              dataKey={ano}
              stroke={cores[index % cores.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={`${ano}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
