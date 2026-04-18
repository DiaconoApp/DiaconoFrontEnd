import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { getEvolucaoMinisterio, getQtdMembrosMinisterios } from "../../../services/dashboards";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function transformarParaLinha(dados, anoInicio, anoFim) {
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

export default function GraficoEvolucaoMinisterio({ anoInicio, anoFim }) {
  const [ministerios, setMinisterios] = useState([]);
  const [ministerioSelecionado, setMinisterioSelecionado] = useState("");
  const [dadosTratados, setDadosTratados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega lista de ministérios
  useEffect(() => {
    async function carregarMinisterios() {
      try {
        setCarregando(true);
        const res = await getQtdMembrosMinisterios(anoInicio, anoFim);
        
        const ministeriosList = res.map((item) => ({
          id: item.id || item.ministerioId,
          nome: item.name || item.nomeMinisterio,
        }));

        setMinisterios(ministeriosList);
        
        // Define o primeiro ministério como selecionado
        if (ministeriosList.length > 0) {
          setMinisterioSelecionado(ministeriosList[0].id);
        }
      } catch (e) {
        console.error("Erro ao carregar ministérios:", e);
        setMinisterios([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarMinisterios();
  }, [anoInicio, anoFim]);

  // Carrega dados de evolução quando ministério muda
  useEffect(() => {
    if (!ministerioSelecionado) return;

    async function carregar() {
      try {
        setCarregando(true);
        const bruto = await getEvolucaoMinisterio(ministerioSelecionado, anoInicio, anoFim);
        const formatado = transformarParaLinha(bruto, anoInicio, anoFim);
        setDadosTratados(formatado);
      } catch (e) {
        console.error("Erro ao carregar evolução:", e);
        setDadosTratados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [ministerioSelecionado, anoInicio, anoFim]);

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-icf-primary-400">Evolução de Membros</h2>
        <Select value={ministerioSelecionado} onValueChange={setMinisterioSelecionado}>
          <SelectTrigger className="w-48 bg-white border-icf-primary-100 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ministerios.map((ministerio) => (
              <SelectItem key={ministerio.id} value={String(ministerio.id)}>
                {ministerio.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-80 text-icf-primary-300">
          Carregando...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dadosTratados} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="mes" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip 
              formatter={(value) => [`${value} membros`, "Média/Membro"]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            {/* Renderiza linhas para cada ano */}
            {Array.from({ length: anoFim - anoInicio + 1 }, (_, i) => anoInicio + i).map((ano, idx) => {
              const cores = ['#10b981', '#059669', '#047857', '#065f46'];
              return (
                <Line 
                  key={ano}
                  type="monotone" 
                  dataKey={String(ano)} 
                  stroke={cores[idx % cores.length]}
                  strokeWidth={2}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
