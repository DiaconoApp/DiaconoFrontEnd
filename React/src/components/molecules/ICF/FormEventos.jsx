import { useState } from "react";

export function FormEventos({ initialData = {}, organizer = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: initialData.nome || "",
    publico: initialData.publico || "",
    escala: initialData.escala || "",
    data: initialData.data || "",
    inicio: initialData.inicio || "",
    fim: initialData.fim || "",
    custo: initialData.custo || "",
    local: initialData.local || "",
    descricao: initialData.descricao || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    else console.log("submit:", formData);
  };

  return (
    <div className="flex w-full">
      <div className="bg-white rounded-l-lg p-6 w-[57%] col-span-3">
        <h2 className="text-2xl font-bold tracking-[-0.4px] mb-4">Adicionar Evento</h2>

          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <label className="text-base text-icf-primary-400">Nome do evento</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Culto de Jovens"
                  className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-base text-icf-primary-400">Público-alvo</label>
                  <select
                    name="publico"
                    value={formData.publico}
                    onChange={handleChange}
                    className="mt-1 w-full text-base disabled:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  >
                    <option value="" disabled >Selecione...</option>
                    <option value="jovens">Ministério de Jovens</option>
                    <option value="adultos">Adultos</option>
                  </select>
                </div>

                <div>
                  <label className="text-base text-icf-primary-400">Escala</label>
                  <select
                    name="escala"
                    value={formData.escala}
                    onChange={handleChange}
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  >
                    <option value="">Ministérios obrigatórios</option>
                    <option value="musica">Ministério de Música</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end gap-3 w-full">
                <div className="w-[35%]">
                  <label className="text-base text-icf-primary-400">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <div className="w-[17.5%]">
                  <label className="text-base text-icf-primary-400">Início</label>
                  <input
                    type="time"
                    name="inicio"
                    value={formData.inicio}
                    onChange={handleChange}
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <div className="pb-3">
                  <span className="text-base text-icf-primary-200">Até</span>
                </div>
              <div className="w-[17.5%]">
                    <label className="text-base text-icf-primary-400">Fim</label>
                    <input
                      type="time"
                      name="fim"
                      value={formData.fim}
                      onChange={handleChange}
                      className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                    />
              </div>
              <button
                    type="button"
                    className="w-[25%] px-4 py-2.5 rounded-md bg-icf-primary-50 flex justify-center items-center gap-2 text-icf-primary-300 text-base cursor-pointer"
                    onClick={() => setShowRecorrente(true)}
              >
                <img src="/public/calendario.png" alt="" className="w-4 h-4"/>
                    Tornar Recorrente
              </button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-[100%]">
                <div>
                  <label className="text-base text-icf-primary-400">Custo</label>
                  <input
                    type="number"
                    name="custo"
                    value={formData.custo}
                    onChange={handleChange}
                    placeholder="R$ 0,00"
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <div>
                  <label className="text-base text-icf-primary-400">Local</label>
                  <select
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  >
                    <option value="">Adicionar localização</option>
                    <option value="igreja">Igreja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-base text-icf-primary-400">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={5}
                  className="mt-1 h-16 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="px-8 py-3 rounded-lg bg-icf-primary-200 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                  Cancelar
                </button>
                <button type="submit" className="py-3 px-8 rounded-lg bg-icf-primary-400 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                  Salvar
                </button>
              </div>
            </form>
          </div>  
      </div>
      <div className="bg-white border-l rounded-r-lg py-4 px-9 border-icf-primary-100 col-span-1">
              <h3 className="pt-8 text-base font-bold text-icf-primary-400">Organizador</h3>

              <div className="flex items-center gap-1 mt-3">
                <img
                  src={organizer.avatar || "/public/calendario.png"}
                  alt={organizer.name || "Avatar organizador"}
                  className="w-7 h-7 border border-icf-primary-300 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-semibold text-icf-primary-400">{organizer.name || "Samuel Nicolau"}</div>
                  <div className="text-[10px] tracking-[0.5px] font-light text-icf-primary-300">{organizer.role || "Organizador"}</div>
                </div>
              </div>
            </div>
    </div>
  );
}