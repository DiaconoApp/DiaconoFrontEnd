import { useEffect, useMemo, useState } from "react";
import { buscarTodosMembros } from "../../../services/membros";

function formatarTelefone(valor) {
  if (!valor) return "-";

  const somenteNumeros = String(valor).replace(/\D/g, "");

  if (somenteNumeros.length === 11) {
    return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2, 7)}-${somenteNumeros.slice(7)}`;
  }

  if (somenteNumeros.length === 10) {
    return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2, 6)}-${somenteNumeros.slice(6)}`;
  }

  return valor;
}

function formatarDataCurta(data) {
  if (!data) return "-";

  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) return "-";

  return dataObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function getMesAtualNome() {
  return new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
}

export default function TabelaAniversariantesMembros() {
  const [membros, setMembros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const mesAtual = useMemo(() => new Date().getMonth(), []);
  const nomeMesAtual = useMemo(() => getMesAtualNome(), []);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);

      try {
        const todosMembros = await buscarTodosMembros();

        const aniversariantes = todosMembros
          .filter((membro) => {
            if (!membro?.dataNascimento) return false;
            const data = new Date(membro.dataNascimento);
            return !Number.isNaN(data.getTime()) && data.getMonth() === mesAtual;
          })
          .sort((a, b) => new Date(a.dataNascimento).getDate() - new Date(b.dataNascimento).getDate());

        setMembros(aniversariantes);
      } catch (error) {
        console.error("Erro ao carregar aniversariantes:", error);
        setMembros([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [mesAtual]);

  return (
    <div className="rounded-xl border border-icf-primary-50 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-icf-primary-400">Aniversariantes do mês</h2>
        <span className="text-sm text-icf-primary-300 capitalize">{nomeMesAtual}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse table-fixed">
          <thead>
            <tr className="border-b border-icf-primary-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-icf-primary-300">
              <th className="py-3 pr-4">Nome</th>
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Telefone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icf-primary-50">
            {carregando ? (
              <tr>
                <td className="py-6 text-sm text-icf-primary-300" colSpan={4}>
                  Carregando aniversariantes...
                </td>
              </tr>
            ) : membros.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-icf-primary-300" colSpan={4}>
                  Nenhum aniversariante encontrado neste mês.
                </td>
              </tr>
            ) : (
              membros.map((membro) => (
                <tr key={membro.idExterno || membro.id || membro.nome} className="text-sm text-icf-primary-400">
                  <td className="py-3 pr-4 font-medium">{membro.nome || "-"}</td>
                  <td className="py-3 pr-4 text-icf-primary-300">{formatarDataCurta(membro.dataNascimento)}</td>
                  <td className="py-3 pr-4 text-icf-primary-300">{membro.email || "-"}</td>
                  <td className="py-3 pr-4 text-icf-primary-300">{formatarTelefone(membro.celular || membro.numeroCelular)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
