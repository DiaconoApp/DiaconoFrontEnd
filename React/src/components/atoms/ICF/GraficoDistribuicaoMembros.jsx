import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getFaixaEtariaMembros, getGeneroMembros } from "../../../services/dashboards";

const coresFaixa = ["#0D5E7D", "#1B7F8F", "#2E9EA8", "#4CA77F", "#7BA85A"];
const coresGenero = ["#0D5E7D", "#4CA77F"];

function GraficoPizza({ dados, cores }) {
  return (
    <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
      <div className="h-[180px] w-full md:h-[200px] md:flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "2px solid #E5E7EB",
                borderRadius: "8px",
                color: "#1C1C1C",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {dados.map((_, i) => (
                <Cell key={i} fill={cores[i % cores.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-icf-primary-300 md:flex-col md:flex-nowrap md:justify-start md:gap-2">
        {dados.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: cores[i % cores.length] }}
            />
            <span className="whitespace-nowrap">
              {item.name}{" "}
              <span className="text-icf-primary-200">{Math.round(item.value)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GraficoDistribuicaoMembros({ anoInicio, anoFim }) {
  const [genero, setGenero] = useState([]);
  const [faixaEtaria, setFaixaEtaria] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [dadosGenero, dadosFaixa] = await Promise.all([
          getGeneroMembros(anoInicio, anoFim),
          getFaixaEtariaMembros(anoInicio, anoFim),
        ]);

        setGenero([
          { name: "Feminino", value: dadosGenero.feminino || 0 },
          { name: "Masculino", value: dadosGenero.masculino || 0 },
        ]);

        setFaixaEtaria([
          { name: "Crianças", value: dadosFaixa.criancas || 0 },
          { name: "Adolescentes", value: dadosFaixa.adolescentes || 0 },
          { name: "Jovens", value: dadosFaixa.jovens || 0 },
          { name: "Adultos", value: dadosFaixa.adultos || 0 },
          { name: "Idosos", value: dadosFaixa.idosos || 0 },
        ]);
      } catch (e) {
        console.error("Erro ao carregar distribuição:", e);
      }
    }
    carregar();
  }, [anoInicio, anoFim]);

  return (
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-icf-primary-400">Distribuição de membros</h2>
        <p className="text-sm text-icf-primary-300">Distribuição por faixa etária e gênero</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <p className="mb-3 text-sm font-medium text-icf-primary-300">Faixa etária</p>
          <GraficoPizza dados={faixaEtaria} cores={coresFaixa} />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-icf-primary-300">Gênero</p>
          <GraficoPizza dados={genero} cores={coresGenero} />
        </div>
      </div>
    </div>
  );
}
