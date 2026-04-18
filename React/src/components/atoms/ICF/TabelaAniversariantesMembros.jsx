import { useEffect, useState } from "react";
import { getAniversariantesMes } from "../../../services/dashboards";

export default function TabelaAniversariantesMembros() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const dataAtual = new Date();
        const mes = dataAtual.getMonth() + 1; // getMonth retorna 0-11
        const ano = dataAtual.getFullYear();
        
        const res = await getAniversariantesMes(mes, ano);
        
        // Garante que res é um array
        const aniversariantes = Array.isArray(res) ? res : res?.membros || [];
        setDados(aniversariantes);
      } catch (e) {
        console.error("Erro ao carregar aniversariantes:", e);
        setDados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const getNomeMes = (mes) => {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                   "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return meses[mes - 1] || "Atual";
  };

  return (
    <div className="bg-white shadow-sm p-5 rounded-xl h-full flex flex-col">
      <h2 className="font-semibold text-icf-primary-400 mb-1">Aniversariantes do mês</h2>
      <span className="text-sm text-icf-primary-300 mb-4">
        {getNomeMes(new Date().getMonth() + 1)}
      </span>

      {carregando ? (
        <div className="flex items-center justify-center flex-1 text-icf-primary-300">
          Carregando...
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left font-semibold text-icf-primary-400 border-b border-icf-primary-100">
                <th className="py-3 px-2">Nome</th>
                <th className="py-3 px-2">Data</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {dados.length > 0 ? (
                dados.map((membro, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-icf-primary-100 hover:bg-icf-primary-50 transition-colors"
                  >
                    <td className="py-3 px-2 text-icf-primary-300">
                      {membro.nome || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-icf-primary-300">
                      {membro.dataNascimento ? new Date(membro.dataNascimento).toLocaleDateString('pt-BR') : membro.data || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-icf-primary-300">
                      {membro.email || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-icf-primary-300">
                      {membro.telefone || membro.phone || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-icf-primary-300">
                    Nenhum aniversariante este mês
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
