import { useState } from "react";

export function FormEventos() {
  const [formData, setFormData] = useState({
    nome: "",
    publico: "",
    escala: "",
    data: "",
    inicio: "",
    fim: "",
    custo: "",
    local: "",
    descricao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Evento salvo:", formData);
    // aqui você pode integrar com backend
  };

    return(
        <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold tracking-[-0.3px] text-icf-primary-400">Adicionar Evento</h2>

      {/* Nome */}
      <div className="flex flex-col gap-2">
        <label className="text-base text-icf-primary-400">
          Nome do evento
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Digite o nome do evento"
          className="w-full bg-surface-50 border border-icf-primary-100 rounded-md py-3 px-4"
        />
      </div>

      {/* Público-alvo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Público-alvo
        </label>
        <select
          name="publico"
          value={formData.publico}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Selecione...</option>
          <option value="ministerio">Ministério de Jovens</option>
          <option value="adultos">Adultos</option>
        </select>
      </div>

      {/* Escala */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Escala
        </label>
        <select
          name="escala"
          value={formData.escala}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Selecione...</option>
          <option value="musica">Ministério de Música</option>
          <option value="midia">Ministério de Mídia</option>
        </select>
      </div>

      {/* Data, Início, Fim */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Início</label>
          <input
            type="time"
            name="inicio"
            value={formData.inicio}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fim</label>
          <input
            type="time"
            name="fim"
            value={formData.fim}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Custo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Custo</label>
        <input
          type="number"
          name="custo"
          value={formData.custo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Local */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Local</label>
        <select
          name="local"
          value={formData.local}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Adicionar localização</option>
          <option value="igreja">Igreja</option>
          <option value="salão">Salão Social</option>
        </select>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Botões */}
      <div className="flex gap-4 justify-end">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Salvar
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
    );
}