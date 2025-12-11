import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { getEvolucaoMembros } from "../../../services/dashboards";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const CORES_ANO = {
  2020: "#4C7CF3",
  2021: "#10B981",
  2022: "#F59E0B",
  2023: "#EC4899",
  2024: "#6366F1",
  2025: "#0EA5E9",
};


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
    <div className="bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Evolução da quantidade novos de membros</h2>

      <LineChart width="100%" height={400} data={dadosTratados}>
        {/* <Line type="monotone" dataKey="qtd" stroke="#4C7CF3" strokeWidth={3} dot /> */}
        <CartesianGrid stroke="#ddd" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
         {Array.from({ length: anoFim - anoInicio + 1 }).map((_, i) => {
          const ano = anoInicio + i;
          return (
            <Line
              key={ano}
              type="monotone"
              dataKey={ano}
              strokeWidth={3}
              stroke={CORES_ANO[ano] || `#${((ano * 999999) % 0xffffff).toString(16)}`}
              dot={{ r: 4 }}
              name={`${ano}`} // **Nome na legenda**
            />
          );
        })}
      </LineChart>
    </div>
  );
}
