import { useEffect, useMemo, useState } from "react";
import { buscarTodosMembros } from "../../../services/membros";

function formatarTelefone(valor) {
  if (!valor) return "-";
  const n = String(valor).replace(/\D/g, "");
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return valor;
}

function formatarDataCurta(data) {
  if (!data) return "-";
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
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
        const todos = await buscarTodosMembros();
        const aniversariantes = todos
          .filter((m) => {
            if (!m?.dataNascimento) return false;
            const d = new Date(m.dataNascimento);
            return !Number.isNaN(d.getTime()) && d.getMonth() === mesAtual;
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
    <div className="rounded-xl border border-icf-primary-50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-icf-primary-400">Aniversariantes do mês</h2>
        <span className="capitalize text-sm text-icf-primary-300">{nomeMesAtual}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            {/* Mobile: Nome 40% | Data 20% | Email 40% */}
            {/* Desktop (md+): Nome 30% | Data 15% | Email 35% | Telefone 20% */}
            <col className="w-[40%] md:w-[30%]" />
            <col className="w-[20%] md:w-[15%]" />
            <col className="w-[40%] md:w-[35%]" />
            <col className="hidden md:table-column md:w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-icf-primary-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-icf-primary-300">
              <th className="py-3 pr-3">Nome</th>
              <th className="py-3 pr-3">Data</th>
              <th className="py-3 pr-3">Email</th>
              <th className="hidden py-3 md:table-cell">Telefone</th>
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
                <tr
                  key={membro.idExterno || membro.id || membro.nome}
                  className="text-sm text-icf-primary-400"
                >
                  <td className="truncate py-3 pr-3 font-medium">{membro.nome || "-"}</td>
                  <td className="py-3 pr-3 text-icf-primary-300">{formatarDataCurta(membro.dataNascimento)}</td>
                  <td className="truncate py-3 pr-3 text-icf-primary-300">{membro.email || "-"}</td>
                  <td className="hidden truncate py-3 text-icf-primary-300 md:table-cell">
                    {formatarTelefone(membro.celular || membro.numeroCelular)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
