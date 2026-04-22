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
  const cores = ["#0D5E7D", "#1B7F8F", "#2E9EA8", "#4CA77F", "#7BA85A", "#BAA045"];

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
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold text-icf-primary-400">Evolução de membros do ministério</h2>
          <p className="text-sm text-icf-primary-300">Comparativo mensal por ministério selecionado</p>
        </div>

        <select
          value={idMinisterioSelecionado || ""}
          onChange={(e) => setIdMinisterioSelecionado(e.target.value)}
          className="min-w-40 rounded-lg border border-icf-primary-100 bg-white px-3 py-2 text-sm font-medium text-icf-primary-400 outline-none transition-colors focus:border-icf-primary-200"
        >
          {ministerios.map((m) => (
            <option key={m.idExterno} value={m.idExterno}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.7} stroke="#E5E7EB" />
          <XAxis 
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: '#595959', fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: '#595959', fontWeight: 500 }}
          />
          <Tooltip 
            cursor={{ stroke: '#0D2750', strokeWidth: 2, opacity: 0.3 }}
            labelStyle={{ color: '#1C1C1C', fontWeight: 700 }}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '2px solid #0D2750',
              borderRadius: '8px',
              color: '#1C1C1C',
              boxShadow: '0 4px 12px rgba(13, 39, 80, 0.15)'
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: 13, color: '#1C1C1C', fontWeight: 600, paddingBottom: 16 }}
          />

          {anos.map((ano, index) => (
            <Line
              key={ano}
              type="monotone"
              dataKey={ano}
              stroke={cores[index % cores.length]}
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              activeDot={{ r: 6, fill: cores[index % cores.length], stroke: '#ffffff', strokeWidth: 3 }}
              name={`${ano}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
