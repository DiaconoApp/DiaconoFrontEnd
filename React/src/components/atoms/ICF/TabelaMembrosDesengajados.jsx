import { useEffect, useState } from "react";
import { getMembrosDesengajados } from "../../../services/dashboards";

export default function TabelaMembrosDesengajados({ anoInicio, anoFim, limitePercentual = 50 }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const res = await getMembrosDesengajados(anoInicio, anoFim, limitePercentual);
        
        // Garante que res é um array
        const membros = Array.isArray(res) ? res : res?.membros || [];
        setDados(membros);
      } catch (e) {
        console.error("Erro ao carregar membros desengajados:", e);
        setDados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [anoInicio, anoFim, limitePercentual]);

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl h-full flex flex-col">
      <h2 className="font-semibold text-icf-primary-400 mb-1">Membros Desengajados</h2>
      <span className="text-sm text-icf-primary-300 mb-4">
        Abaixo de {limitePercentual}% de Participação
      </span>

      {carregando ? (
        <div className="flex items-center justify-center flex-1 text-icf-primary-300">
          Carregando...
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-sm font-semibold text-icf-primary-400 border-b border-icf-primary-100">
                <th className="py-3 px-2">Nome</th>
                <th className="py-3 px-2">Ministério</th>
                <th className="py-3 px-2">Taxa</th>
                <th className="py-3 px-2">Telefone</th>
                <th className="py-3 px-2">Discipulador</th>
              </tr>
            </thead>
            <tbody>
              {dados.length > 0 ? (
                dados.map((membro, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-icf-primary-100 hover:bg-icf-primary-50 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-icf-primary-300">
                      {membro.nome || membro.nomeMembroMinisterio || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span className="bg-icf-primary-100 text-icf-primary-400 px-2 py-1 rounded text-xs font-medium">
                        {membro.ministerio || membro.nomeMinisterio || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm font-semibold text-red-600">
                      {membro.percentualParticipacao || membro.taxa || 0}%
                    </td>
                    <td className="py-3 px-2 text-sm text-icf-primary-300">
                      {membro.telefone || membro.phone || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-sm text-icf-primary-300">
                      {membro.discipulador || membro.nomePastorCelula || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-icf-primary-300">
                    Nenhum membro desengajado encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
