import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getFaixaEtariaMembros, getGeneroMembros } from "../../../services/dashboards";

const coresFaixa = ["#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b"];
const coresGenero = ["#f472b6", "#60a5fa"];

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
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold text-white">Distribuição de membros</h2>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-300">Faixa etária</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Pie
                  data={faixaEtaria}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {faixaEtaria.map((_, i) => (
                    <Cell key={i} fill={coresFaixa[i % coresFaixa.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <ul className="hidden flex-col gap-2 text-sm text-slate-300 md:flex">
              {faixaEtaria.map((item, i) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: coresFaixa[i % coresFaixa.length] }} />
                  {item.name} <span className="text-slate-400">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-300">Gênero</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Pie
                  data={genero}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genero.map((_, i) => (
                    <Cell key={i} fill={coresGenero[i % coresGenero.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <ul className="hidden flex-col gap-2 text-sm text-slate-300 md:flex">
              {genero.map((item, i) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: coresGenero[i % coresGenero.length] }} />
                  {item.name} <span className="text-slate-400">{Math.round(item.value)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
