import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getFaixaEtariaMembros, getGeneroMembros } from "../../../services/dashboards";

const coresFaixa = ["#0D5E7D", "#1B7F8F", "#2E9EA8", "#4CA77F", "#7BA85A"];
const coresGenero = ["#0D5E7D", "#4CA77F"];

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium text-icf-primary-300">Faixa etária</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#1C1C1C',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Pie
                  data={faixaEtaria}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {faixaEtaria.map((_, i) => (
                    <Cell key={i} fill={coresFaixa[i % coresFaixa.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <ul className="hidden flex-col gap-2 text-sm text-icf-primary-300 md:flex">
              {faixaEtaria.map((item, i) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: coresFaixa[i % coresFaixa.length] }} />
                  {item.name} <span className="text-icf-primary-200">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-icf-primary-300">Gênero</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#1C1C1C',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Pie
                  data={genero}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genero.map((_, i) => (
                    <Cell key={i} fill={coresGenero[i % coresGenero.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <ul className="hidden flex-col gap-2 text-sm text-icf-primary-300 md:flex">
              {genero.map((item, i) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: coresGenero[i % coresGenero.length] }} />
                  {item.name} <span className="text-icf-primary-200">{Math.round(item.value)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
