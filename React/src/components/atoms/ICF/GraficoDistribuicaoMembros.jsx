import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { getFaixaEtariaMembros, getGeneroMembros } from "../../../services/dashboards";
import { useEffect, useState } from "react";

const faixaEtaria = [
  { name: "0–17 anos", value: 45 },
  { name: "18–35 anos", value: 30 },
  { name: "36–55 anos", value: 25 },
];


const coresFaixa = ["#B3DDB3", "#8BCF8B", "#5CAA5C", "#329932", "#007700"];
const coresGenero = ["#B3DDB3", "#5CAA5C"];

export default function GraficoDistribuicaoMembros({ anoInicio, anoFim }) {

      const [genero, setGenero] = useState([]);
      const [faixaEtaria, setFaixaEtaria] = useState([]);

      useEffect(() => {
    async function carregarGenero() {
      try {
        const dados = await getGeneroMembros( anoInicio, anoFim );

        // supondo que a API retorna assim:
        // { feminino: 45, masculino: 55 }
        const formatado = [
          { name: "Feminino", value: dados.feminino },
          { name: "Masculino", value: dados.masculino },
        ];

        setGenero(formatado);
      } catch (e) {
        console.error("Erro ao carregar gênero:", e);
      }
    }

    carregarGenero();
  }, [anoInicio, anoFim]);

   async function carregarFaixaEtaria() {
    try {
      const dados = await getFaixaEtariaMembros(anoInicio, anoFim);

      // backend retorna:
      // { criancas: 5, adolescentes: 0, jovens: 30, adultos: 65, idosos: 0 }

      const formatado = [
        { name: "Crianças", value: dados.criancas },
        { name: "Adolescentes", value: dados.adolescentes },
        { name: "Jovens", value: dados.jovens },
        { name: "Adultos", value: dados.adultos },
        { name: "Idosos", value: dados.idosos },
      ];

      setFaixaEtaria(formatado);
    } catch (e) {
      console.error("Erro ao carregar faixa etária:", e);
    }
  }

   useEffect(() => {
    carregarFaixaEtaria();
  }, [anoInicio, anoFim]);

      
  return (
    <div className="bg-white shadow p-6 rounded-xl w-full">
      <h2 className="text-2xl font-bold mb-4">Distribuição dos Membros</h2>

      <div className="grid grid-cols-2 gap-6">
        
        {/* --- Faixa Etária --- */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="font-medium ml-2.5 text-icf-primary-300">Faixa Etária</span>

            <PieChart width={180} height={180}>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Pie
                data={faixaEtaria}
                cx={90}
                cy={90}
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {coresFaixa.map((cor, i) => (
                  <Cell key={i} fill={cor} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <ul className="flex flex-col justify-around gap-2 text-sm">
            {faixaEtaria.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: coresFaixa[i] }}
                ></span>
                {item.name} <span className="ml-1 text-gray-500">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Gênero --- */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="font-medium ml-2.5 text-icf-primary-300">Gênero</span>

            <PieChart width={180} height={180}>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Pie
                data={genero}
                cx={90}
                cy={90}
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {coresGenero.map((cor, i) => (
                  <Cell key={i} fill={cor} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <ul className="flex flex-col gap-2 text-sm">
            {genero.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: coresGenero[i] }}
                ></span>
                {item.name} <span className="ml-1 text-gray-500">{Math.round(item.value)}%</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
