import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { getQtdEventosMinisterios } from "../../../services/dashboards";

const coresVerdes = ['#10b981', '#059669', '#047857', '#065f46', '#0a5f45', '#064e40', '#063d35', '#022d27'];

export function GraficoEventosPorMinisterioHorizontal({ anoInicio, anoFim }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const res = await getQtdEventosMinisterios(anoInicio, anoFim);

        // Formata os dados para o Recharts
        const formatado = res.map((item) => ({
          nome: item.nomeMinisterio,
          qtd: item.quantidadeEventos,
        }));

        setDados(formatado);
      } catch (e) {
        console.error("Erro ao carregar gráfico de eventos:", e);
        setDados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [anoInicio, anoFim]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full flex flex-col">
      <h2 className="font-semibold text-icf-primary-400 mb-4">Eventos por Ministério</h2>

      {carregando ? (
        <div className="flex items-center justify-center flex-1 text-icf-primary-300">
          Carregando...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={dados}
            layout="vertical"
            margin={{ top: 10, right: 30, bottom: 10, left: 100 }}
          >
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />

            <YAxis 
              dataKey="nome"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              width={90}
            />

            <Tooltip 
              formatter={(v) => [`${v} eventos`, "Quantidade"]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />

            <Bar dataKey="qtd" radius={[0, 4, 4, 0]}>
              {dados.map((_, index) => (
                <Cell key={`cell-${index}`} fill={coresVerdes[index % coresVerdes.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
