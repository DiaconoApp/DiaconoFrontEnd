export default function TabelaAniversariantes() {
  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-1">Aniversariantes do mês</h2>
      <span className="text-sm text-icf-primary-200">Novembro</span>

      <table className="w-full border-collapse table-fixed mt-4">
        <thead className="text-left text-icf-primary-400">
          <tr className="text-base font-normal text-icf-primary-400">
            <th>Nome</th>
            <th>Data</th>
            <th>Email</th>
            <th>Telefone</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t-[0.5px] border-icf-primary-100">
            <td className="py-3">Ana Carolina Lima</td>
            <td className="py-3">11/11</td>
            <td className="py-3">ana@gmail.com</td>
            <td className="py-3">(11) 98765-4321</td>
          </tr>
          <tr className="border-t-[0.5px] border-icf-primary-100">
            <td className="py-3">Ana Carolina Lima</td>
            <td className="py-3">11/11</td>
            <td className="py-3">ana@gmail.com</td>
            <td className="py-3">(11) 98765-4321</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
