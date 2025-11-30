import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ModalExclusao } from "./ModalExclusao";
import { ModalExclusaoRecorrencia } from "./ModalExclusaoRecorrencia";
import { ModalLocal1 } from "./ModalLocal1";
import { ModalRecorrente } from "./ModalRecorrente";

import { transformationName } from "../../../utils/Utils";
import {
  buscarEventoPorId,
  criarEvento,
  deletarEventoMultiplos,
  deletarEventoUnico,
  editarEvento
} from "../../../services/eventos";
import { buscarMinisterios } from "../../../services/ministerios";

/*
  FormEventos
  - organizado em seções: constantes, estados, effects, handlers e JSX
  - mantive a lógica de edição/criação/exclusão existente
  - comentários explicativos para facilitar manutenção
*/

export function FormEventos() {
  // -----------------------
  // Constantes / Router
  // -----------------------
  const navigate = useNavigate();
  const { idEvento } = useParams();
  const modoEdicao = Boolean(idEvento);

  // -----------------------
  // Estados (agrupados por responsabilidade)
  // -----------------------
  // UI / modais
  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
  const [isModalExcluirRecorrenciaOpen, setIsModalExcluirRecorrenciaOpen] = useState(false);
  const [isModalRecorrencia, setShowRecorrente] = useState(false);
  const [modalLocalAberto, setModalLocalAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Form / dados
  const [formData, setFormData] = useState({
    titulo: "",
    publicoAlvo: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    valor: "",
    localId: "",
    descricao: "",
    ministeriosSelecionados: [],
    recorrencia: {
      tipoRecorrencia: "NAO_REPETE",
      dataInicioRecorrencia: "",
      dataTerminoRecorrencia: ""
    }
  });

  // Seleção de ministérios / endereço / opcões
  const [ministerios, setMinisterios] = useState([]);
  const [endereco, setEndereco] = useState(null);
  const [opcaoRecorrencia, setOpcaoRecorrencia] = useState("unico");

  // Info do usuário/organizador
  const [nome, setNome] = useState("");

  // -----------------------
  // Effects (buscas e listeners)
  // -----------------------
  useEffect(() => {
    // buscar ministérios
    buscarMinisterios().then(data => setMinisterios(data));

    // nome do organizador salvo localmente
    const nomeSalvo = localStorage.getItem("nome");
    if (nomeSalvo) setNome(nomeSalvo);
  }, []);

  useEffect(() => {
    // fecha dropdown ao clicar fora
    function handleClickOutside(e) {
      if (!e.target.closest(".dropdown-ministerios")) {
        setDropdownAberto(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    // quando em modo edição, popula formulário com dados do evento
    if (!modoEdicao) return;

    buscarEventoPorId(idEvento).then(evento => {
      if (!evento) return;

      setFormData({
        titulo: evento.nome,
        descricao: evento.descricao,
        publicoAlvo: evento.publicoAlvo,
        dataHoraInicio: evento.dataHoraInicio,
        dataHoraFim: evento.dataHoraFim,
        valor: evento.custo,
        ministeriosSelecionados: evento.ministerios?.map(m => m.idExterno) || [],
        recorrencia: {
          tipoRecorrencia: evento.recorrencia?.tipoRecorrencia || "NAO_REPETE",
          dataInicioRecorrencia: evento.recorrencia?.dataInicioRecorrencia || "",
          dataTerminoRecorrencia: evento.recorrencia?.dataTerminoRecorrencia || ""
        }
      });

      setEndereco({
        idExterno: evento?.enderecoEvento?.idExterno || null,
        cep: evento?.enderecoEvento?.cep,
        cidade: evento?.enderecoEvento?.cidade,
        bairro: evento?.enderecoEvento?.bairro,
        rua: evento?.enderecoEvento?.rua,
        complemento: evento?.enderecoEvento?.complemento,
        numero: evento?.enderecoEvento?.numero,
        apelido: evento?.enderecoEvento?.apelido
      });
    });
  }, [idEvento, modoEdicao]);

  // -----------------------
  // Handlers / Helpers
  // -----------------------

  // Atualiza formulário com suporte a fields simples (name -> chave direta)
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mantém comportamento existente: mapear "vazio" para "00:00" em campos de hora antigos
    setFormData((prev) => ({
      ...prev,
      [name]:
        value === "" && (name === "horaInicio" || name === "horaFim")
          ? "00:00"
          : value,
    }));
  };

  // Salva/atualiza endereço vindo do modal de local
  function handleSalvarEndereco(enderecoSalvo) {
    setEndereco(enderecoSalvo);
    console.log("Endereço salvo no formulário:", enderecoSalvo);
    setModalLocalAberto(false);
  }

  // Abre modal de exclusão apropriado:
  // - se tiver recorrência (diferente de NAO_REPETE) abre modal com opção
  // - caso contrário abre modal simples de exclusão
  function abrirModalExclusao() {
    const isRecorrente = Boolean(formData?.recorrencia && formData.recorrencia.tipoRecorrencia !== "NAO_REPETE");

    if (isRecorrente) {
      setIsModalExcluirRecorrenciaOpen(true);
    } else {
      setIsModalExcluirOpen(true);
    }
  }

  // Confirmação: excluir apenas o evento atual
  async function confirmarExcluirUnico() {
    try {
      await deletarEventoUnico(idEvento);
    } catch (error) {
      alert("Erro ao excluir evento CAIU AQUI");
      return;
    }

    alert("Evento excluído com sucesso!");
    setIsModalExcluirOpen(false);
    navigate("/eventos");
    // atualizarCalendario() -> função externa usada em outras partes da app
    if (typeof atualizarCalendario === "function") atualizarCalendario();
  }

  // Confirmação de exclusão quando há recorrência (unico | multiplos)
  async function confirmarExcluirRecorrencia() {
    try {
      if (opcaoRecorrencia === "unico") {
        await deletarEventoUnico(idEvento);
      } else {
        await deletarEventoMultiplos(idEvento);
      }
    } catch (error) {
      alert("Erro ao excluir evento");
      return;
    }

    alert("Evento excluído!");
    setIsModalExcluirRecorrenciaOpen(false);
    navigate("/eventos");
    if (typeof atualizarCalendario === "function") atualizarCalendario();
  }

  // Validação simples antes de salvar
  const validarFormulario = () => {
    if (!formData.titulo.trim()) return "O nome do evento é obrigatório.";
    if (!formData.dataHoraInicio) return "A data do evento é obrigatória.";
    if (!formData.dataHoraFim) return "Informe o horário de início.";
    return null;
  };

  // Submit (criar ou editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarFormulario();
    if (erro) return alert(erro);

    const eventoPayload = {
      nome: formData.titulo,
      descricao: formData.descricao,
      publicoAlvo: formData.publicoAlvo,
      dataHoraInicio: formData.dataHoraInicio,
      dataHoraFim: formData.dataHoraFim,
      custo: Number(formData.valor),
      fkMinisterios: formData.ministeriosSelecionados,
      endereco: {
        idExterno: endereco?.idExterno,
        cep: endereco?.cep,
        estado: endereco?.estado,
        cidade: endereco?.cidade,
        bairro: endereco?.bairro,
        rua: endereco?.rua,
        complemento: endereco?.complemento,
        numero: endereco?.numero,
        apelido: endereco?.apelido,
      },
      recorrencia: {
        tipoRecorrencia: formData.recorrencia.tipoRecorrencia,
        dataInicioRecorrencia: formData.recorrencia.dataInicioRecorrencia,
        dataTerminoRecorrencia: formData.recorrencia.dataTerminoRecorrencia
      }
    };

    try {
      if (modoEdicao) {
        await editarEvento(idEvento, eventoPayload);
        alert("Evento atualizado com sucesso!");
      } else {
        await criarEvento(eventoPayload);
        alert("Evento criado com sucesso!");
      }
      navigate("/eventos");
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento. Tente novamente.");
    }
  };

  // -----------------------
  // JSX (formulário dividido em blocos, preservei classes/tailwind)
  // -----------------------
  return (
    <div className="flex w-full">
      <div className="bg-[#F6F7F9] flex w-full h-full p-2 transition-all duration-300">
        <div className="bg-white rounded-l-lg p-6 col-span-3 w-full">
          <h2 className="text-2xl font-bold tracking-default mb-4">
            {modoEdicao ? "Editar Evento" : "Adicionar Evento"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Nome */}
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

            {/* Público-alvo e Ministérios */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-base text-icf-primary-400">Público-alvo</label>
                <select
                  name="publicoAlvo"
                  value={formData.publicoAlvo}
                  onChange={handleChange}
                  className="mt-1 w-full text-base disabled:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Geral">Membros e visitantes</option>
                  <option value="Membros">Membros</option>
                  <option value="Lideranças">Líderes e Pastores</option>
                </select>
              </div>

              <div className="dropdown-ministerios">
                <label className="text-base text-icf-primary-400">Ministerios obrigatórios</label>
                <button
                  type="button"
                  className="w-full bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4 text-left"
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                >
                  {formData.ministeriosSelecionados.length > 0
                    ? formData.ministeriosSelecionados
                        .map(id => ministerios.find(m => m.idExterno === id)?.nome)
                        .filter(Boolean)
                        .join(", ")
                    : "Selecione os ministérios"}
                </button>

                {dropdownAberto && (
                  <div className="absolute mt-1 w-[500px] bg-white shadow-lg border border-icf-primary-200 rounded-lg max-h-64 overflow-y-auto z-50 p-2">
                    {ministerios.map(m => (
                      <label key={m.idExterno} className="flex items-center gap-3 px-2 py-2 hover:bg-surface-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ministeriosSelecionados.includes(m.idExterno)}
                          onChange={() => {
                            setFormData(prev => {
                              const jaTem = prev.ministeriosSelecionados.includes(m.idExterno);
                              return {
                                ...prev,
                                ministeriosSelecionados: jaTem
                                  ? prev.ministeriosSelecionados.filter(id => id !== m.idExterno)
                                  : [...prev.ministeriosSelecionados, m.idExterno]
                              };
                            });
                          }}
                          className="accent-icf-primary-400"
                        />
                        <span className="text-icf-primary-400">{m.nome}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Data/hora inicio e fim + botão recorrência */}
            <div className="flex items-end gap-3 w-full">
              <div className="w-[35%]">
                <label className="text-base text-icf-primary-400">Data e hora início</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  name="dataHoraInicio"
                  value={formData.dataHoraInicio}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      dataHoraInicio: value,
                      recorrencia: {
                        ...prev.recorrencia,
                        dataInicioRecorrencia: value.split("T")[0],
                        dataTerminoRecorrencia: value.split("T")[0]
                      }
                    }));
                  }}
                />
              </div>

              <div className="w-[35%]">
                <label className="text-base text-icf-primary-400">Data e hora término</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  name="dataHoraFim"
                  value={formData.dataHoraFim}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, dataHoraFim: value }));
                  }}
                />
              </div>

              <button
                type="button"
                className="w-[25%] px-4 py-2.5 rounded-md bg-icf-primary-50 flex justify-center items-center gap-2 text-icf-primary-300 text-base cursor-pointer"
                onClick={() => setShowRecorrente(true)}
              >
                <img src="/public/iconeRecorrencia.svg" alt="" className="w-4 h-4" />
                {formData.recorrencia.tipoRecorrencia === "NAO_REPETE" ? "Tornar recorrente" : "Ajustar recorrência"}
              </button>
            </div>

            {/* Custo / Local */}
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
                  onClick={() => setModalLocalAberto(true)}
                  className="mt-1 w-full text-left text-base placeholder:text-icf-primary-200 text-icf-primary-300 bg-icf-primary-50 rounded-lg py-3 px-4"
                >
                  {endereco ? "Alterar local" : "Cadastrar local"}
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-base text-icf-primary-400">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={5}
                className="mt-1 h-22 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
              />
            </div>

            {/* Ações */}
            <div className="flex gap-3 justify-end mt-4">
              <button type="button" onClick={() => navigate('/eventos')} className="px-8 py-3 rounded-lg bg-icf-primary-200 text-surface-50 text-base font-normal cursor-pointer hover:opacity-90">
                Cancelar
              </button>

              {modoEdicao && (
                <button
                  type="button"
                  onClick={abrirModalExclusao}
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

        {/* Painel do organizador */}
        <aside className="w-[20%] bg-white border-l rounded-r-lg py-4 px-9 border-icf-primary-100 col-span-1">
          <h3 className="pt-8 text-base font-bold text-icf-primary-400">Organizador</h3>

          <div className="flex items-center gap-1 mt-3">
            <img
              src="/public/iconePerfil.svg"
              alt="Avatar organizador"
              className="w-7 h-7 p-1 border border-icf-primary-300 rounded-full object-cover"
            />
            <div>
              <div className="text-xs font-semibold text-icf-primary-400">{transformationName(nome)}</div>
              <div className="text-[10px] tracking-[0.5px] font-light text-icf-primary-300">Organizador</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modais */}
      {isModalExcluirOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalExclusao
            titulo="Excluir evento"
            pergunta="Tem certeza que deseja excluir este evento?"
            onConfirm={confirmarExcluirUnico}
            onCancel={() => setIsModalExcluirOpen(false)}
          />
        </div>
      )}

      {isModalExcluirRecorrenciaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalExclusaoRecorrencia
            opcaoRecorrencia={opcaoRecorrencia}
            setOpcaoRecorrencia={setOpcaoRecorrencia}
            onConfirm={confirmarExcluirRecorrencia}
            onClose={() => setIsModalExcluirRecorrenciaOpen(false)}
          />
        </div>
      )}

      {modalLocalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalLocal1
            onClose={() => setModalLocalAberto(false)}
            onSalvarEndereco={handleSalvarEndereco}
            local={endereco}
          />
        </div>
      )}

      {isModalRecorrencia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalRecorrente
            formData={formData}
            setFormData={setFormData}
            onClose={() => setShowRecorrente(false)}
          />
        </div>
      )}
    </div>
  );
}