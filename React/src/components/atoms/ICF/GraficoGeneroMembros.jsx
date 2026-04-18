import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { getGeneroMembros } from "../../../services/dashboards";

const cores = ["#10b981", "#059669"];

export default function GraficoGeneroMembros({ anoInicio, anoFim }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const res = await getGeneroMembros(anoInicio, anoFim);
        
        // Formata os dados para o Recharts
        const formatado = res.map((item) => ({
          name: item.genero,
          value: item.quantidade || item.quantidadeMembros,
        }));

        setDados(formatado);
      } catch (e) {
        console.error("Erro ao carregar distribuição por gênero:", e);
        setDados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [anoInicio, anoFim]);

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl h-full flex flex-col">
      <h2 className="font-semibold text-icf-primary-400 mb-4">Gênero</h2>

      {carregando ? (
        <div className="flex items-center justify-center flex-1 text-icf-primary-300">
          Carregando...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip 
              formatter={(value) => [`${value} membros`, "Quantidade"]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {dados.map((_, i) => (
                <Cell key={`cell-${i}`} fill={cores[i % cores.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
