import { useState, useEffect } from "react";
import { Menu } from "../../templates/ICF/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { ModalExclusao } from "./ModalExclusao";
import { ModalLocal1 } from "./ModalLocal1";
import { ModalLocal2 } from "./ModalLocal2";
import axios from "axios";

export function FormEventos() {

  const [menuAberto, setMenuAberto] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // ID da URL
  const modoEdicao = Boolean(id); // true se estiver editando

  // Dados do formulário
  const [formData, setFormData] = useState({
    id: Date.now(),
    titulo: "",
    publico: "",
    dataInicio: "",
    horaInicio: "",
    horaFim: "",
    valor: "",
    localId: "",
    descricao: "",
  });

  const [locais, setLocais] = useState([]);
  const [isModalLocal1Open, setIsModalLocal1Open] = useState(false);
  const [isModalLocal2Open, setIsModalLocal2Open] = useState(false);
  const [localParaEditar, setLocalParaEditar] = useState(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);

  // Carregar locais do JSON server
  useEffect(() => {
    axios.get("http://localhost:3000/locais")
      .then(res => setLocais(res.data))
      .catch(err => console.error(err));
  }, []);

  // Selecionar local do modal
  const selecionarLocal = (local) => {
    setFormData(prev => ({ ...prev, localId: local.id }));
    setIsModalLocal2Open(false);
  };

  // Modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null);

  // 🔹 Busca o evento para edição
  useEffect(() => {
    if (modoEdicao) {
      axios
        .get(`http://localhost:3000/eventos/${id}`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Erro ao carregar evento:", err));
    }
  }, [id, modoEdicao]);

  // 🔹 Atualiza os campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        value === "" && (name === "horaInicio" || name === "horaFim")
          ? "00:00"
          : value,
    }));
  };

  // 🔹 Validação simples
  const validarFormulario = () => {
    if (!formData.titulo.trim()) return "O nome do evento é obrigatório.";
    if (!formData.dataInicio) return "A data do evento é obrigatória.";
    if (!formData.horaInicio) return "Informe o horário de início.";
    if (!formData.horaFim) return "Informe o horário de término.";
    return null;
  };

  // 🔹 Criação ou atualização
  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarFormulario();
    if (erro) return alert(erro);

    try {
      if (modoEdicao) {
        await axios.put(
          `http://localhost:3000/eventos/${formData.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/eventos", formData);
      }
      navigate("/eventos");
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento. Tente novamente.");
    }
  };

  // 🔹 Exclusão
  const handleExcluir = (evento) => {
    setEventoParaExcluir(evento);
    setIsDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/eventos/${eventoParaExcluir.id}`
      );
      alert("Evento excluído com sucesso!");
      setIsDeleteModalOpen(false);
      navigate("/eventos");
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      alert("Erro ao excluir o evento.");
    }
  };

  // 🔹 Selecionar local do ModalLocal2
  const handleSelectLocal = (local) => {
    setFormData((prev) => ({ ...prev, localId: local.id }));
  };

  // Layout lateral
  const espacamento = menuAberto ? "ml-70" : "ml-24.5";

  return (
    <div className="flex w-full">
      <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      <div className={`bg-[#F6F7F9] flex w-full min-h-screen ${espacamento} pt-21 p-6 transition-all duration-300`}>
        <div className={`bg-white rounded-l-lg p-6 col-span-3 w-full`}>
          <h2 className="text-2xl font-bold tracking-default mb-4">  {modoEdicao ? "Editar Evento" : "Adicionar Evento"} </h2>

          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <label className="text-base text-icf-primary-400">Nome do evento</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Título"
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
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <div className="w-[17.5%]">
                  <label className="text-base text-icf-primary-400">Início</label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formData.horaInicio}
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
                    name="horaFim"
                    value={formData.horaFim}
                    onChange={handleChange}
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <button
                  type="button"
                  className="w-[25%] px-4 py-2.5 rounded-md bg-icf-primary-50 flex justify-center items-center gap-2 text-icf-primary-300 text-base cursor-pointer"
                  onClick={() => setShowRecorrente(true)}
                >
                  <img src="/public/iconeRecorrencia.svg" alt="" className="w-4 h-4" />
                  Tornar Recorrente
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-[100%]">
                <div>
                  <label className="text-base text-icf-primary-400">Custo</label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="R$ 0,00"
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <div>
                  <label className="text-base text-icf-primary-400">Local</label>
                  <button
                    type="button"
                    onClick={() => setIsModalLocal2Open(true)}
                    className="mt-1 w-full text-left text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  >
                    {formData.localId
                      ? `${locais.find(l => l.id === formData.localId)?.apelido}`
                      : "Selecionar Local"}
                  </button>
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
                <button type="button" onClick={() => navigate('/eventos')} className="px-8 py-3 rounded-lg bg-icf-primary-200 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                  Cancelar
                </button>

                {modoEdicao && (
                  <button
                    type="button"
                    onClick={() => handleExcluir(formData)}
                    className="px-8 py-3 rounded-lg bg-[#D32F2F] text-surface-50 text-base font-normal cursor-pointer hover:opacity-90"
                  >
                    Excluir
                  </button>
                )}

                <button type="submit" className="py-3 px-8 rounded-lg bg-icf-primary-400 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                  {modoEdicao ? "Salvar Alterações" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-[20%] bg-white border-l rounded-r-lg py-4 px-9 border-icf-primary-100 col-span-1">
          <h3 className="pt-8 text-base font-bold text-icf-primary-400">Organizador</h3>

          <div className="flex items-center gap-1 mt-3">
            <img
              src="/public/iconePerfil.svg"
              alt="Avatar organizador"
              className="w-7 h-7 p-1 border border-icf-primary-300 rounded-full object-cover"
            />
            <div>
              <div className="text-xs font-semibold text-icf-primary-400"> Samuel Nicolau</div>
              <div className="text-[10px] tracking-[0.5px] font-light text-icf-primary-300"> Organizador"</div>
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalExclusao
            titulo="Excluir evento"
            pergunta="Tem certeza que deseja excluir este evento?"
            onConfirm={confirmarExclusao}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </div>
      )}

      {/* ⚙️ Modal Local 2 - Lista de endereços */}
      {isModalLocal2Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalLocal2
            onSelect={(local) => {
              setFormData(prev => ({ ...prev, localId: local.id }));
              setIsModalLocal2Open(false);
            }}
            onClose={() => setIsModalLocal2Open(false)}
            onOpenLocal1={(localParaEditar) => {
              setLocalParaEditar(localParaEditar);
              setIsModalLocal1Open(true);
            }}
          />
        </div>
      )}

      {/* ⚙️ Modal Local 1 - Criar/Editar endereço */}
      {isModalLocal1Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalLocal1
            local={localParaEditar}
            onClose={() => setIsModalLocal1Open(false)}
            onSelect={(local) => {
              setLocalSelecionado(local);
              setIsModalLocal2Open(false);
            }}
          />
        </div>
      )}


    </div>
  );
}