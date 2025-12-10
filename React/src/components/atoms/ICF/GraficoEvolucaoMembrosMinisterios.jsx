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
  const cores = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Evolução de Membros do Ministério</h2>

        <select
          value={idMinisterioSelecionado || ""}
          onChange={(e) => setIdMinisterioSelecionado(e.target.value)}
          className="border border-[#AEAEB2] rounded-lg text-[#AEAEB2] bg-white px-3 py-2"
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
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />

          {anos.map((ano, index) => (
            <Line
              key={ano}
              type="monotone"
              dataKey={ano}
              stroke={cores[index % cores.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              name={`${ano}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
