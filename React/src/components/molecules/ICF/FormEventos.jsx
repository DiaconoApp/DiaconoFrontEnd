import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Save, Trash2, MapPin, ChevronDown } from "lucide-react";

import { ModalExclusao } from "./ModalExclusao";
import { ModalExclusaoRecorrencia } from "./ModalExclusaoRecorrencia";
import { ModalLocal1 } from "./ModalLocal1";
import { ModalRecorrente } from "./ModalRecorrente";
import { AlertModal } from "../../ui/AlertModal";

import { PageHeader } from "../../atoms/ICF/PageHeader";
import { Button } from "@/components/ui/button";
import { transformationName } from "../../../utils/Utils";
import {
  buscarEventoPorId,
  criarEvento,
  deletarEventoMultiplos,
  deletarEventoUnico,
  editarEvento
} from "../../../services/eventos";
import { buscarTodosMinisterios } from "../../../services/ministerios";

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
  const [modal, setModal] = useState(null);

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
    buscarTodosMinisterios()
      .then(data => {
        if (Array.isArray(data)) {
          setMinisterios(data);
        } else {
          console.error("Resposta inesperada:", data);
          setMinisterios([]); // fallback seguro
        }
      })
      .catch(err => {
        console.error("Erro ao buscar ministérios:", err);
        setMinisterios([]); // fallback em caso de erro
      });

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
      setModal({
        type: "error",
        title: "Erro",
        message: "Erro ao excluir evento CAIU AQUI"
      });
      return;
    }

    setModal({
      type: "success",
      title: "Sucesso!",
      message: "Evento excluído com sucesso!",
      autoClose: 2000
    });
    setIsModalExcluirOpen(false);
    setTimeout(() => {
      navigate("/eventos");
      // atualizarCalendario() -> função externa usada em outras partes da app
      if (typeof atualizarCalendario === "function") atualizarCalendario();
    }, 2000);
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
      setModal({
        type: "error",
        title: "Erro",
        message: "Erro ao excluir evento"
      });
      return;
    }

    setModal({
      type: "success",
      title: "Sucesso!",
      message: "Evento excluído!",
      autoClose: 2000
    });
    setIsModalExcluirRecorrenciaOpen(false);
    setTimeout(() => {
      navigate("/eventos");
      if (typeof atualizarCalendario === "function") atualizarCalendario();
    }, 2000);
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
    if (erro) {
      setModal({
        type: "warning",
        title: "Campos obrigatórios",
        message: erro
      });
      return;
    }

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
        setModal({
          type: "success",
          title: "Sucesso!",
          message: "Evento atualizado com sucesso!",
          autoClose: 2000
        });
      } else {
        await criarEvento(eventoPayload);
        setModal({
          type: "success",
          title: "Sucesso!",
          message: "Evento criado com sucesso!",
          autoClose: 2000
        });
      }
      setTimeout(() => {
        navigate("/eventos");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setModal({
        type: "error",
        title: "Erro",
        message: "Erro ao salvar evento. Tente novamente."
      });
    }
  };

  // -----------------------
  // JSX (formulário dividido em blocos, preservei classes/tailwind)
  // -----------------------
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        titulo={modoEdicao ? "Editar Evento" : "Novo Evento"}
        descricao="Preencha os dados do evento"
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/eventos')}
          className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50 gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </Button>
        <Button
          form="form-evento"
          type="submit"
          className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white gap-2"
        >
          <Save className="w-4 h-4" />
          Salvar
        </Button>
      </PageHeader>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-sm p-8">

          <form id="form-evento" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nome e Organizador */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-icf-primary-400">Nome do evento</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Culto de Domingo"
                  className="mt-1.5 w-full text-sm placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-icf-primary-400">Organizador</label>
                <input
                  type="text"
                  value={transformationName(nome)}
                  disabled
                  className="mt-1.5 w-full text-sm bg-icf-primary-50 text-icf-primary-300 border border-icf-primary-100 rounded-lg py-3 px-4 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Público-alvo e Ministérios */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-icf-primary-400">Público-alvo</label>
                <div className="relative mt-1.5">
                  <select
                    name="publicoAlvo"
                    value={formData.publicoAlvo}
                    onChange={handleChange}
                    className="w-full text-sm disabled:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:border-icf-primary-300 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecione...</option>
                    <option value="Todos">Todos</option>
                    <option value="Geral">Membros e visitantes</option>
                    <option value="Membros">Membros</option>
                    <option value="Lideranças">Líderes e Pastores</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-icf-primary-300 pointer-events-none" />
                </div>
              </div>

              <div className="dropdown-ministerios relative">
                <label className="text-sm font-medium text-icf-primary-400">Ministérios</label>
                <button
                  type="button"
                  className="mt-1.5 w-full bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 text-left text-sm focus:outline-none focus:border-icf-primary-300 transition-colors"
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                >
                  {formData.ministeriosSelecionados.length > 0
                    ? formData.ministeriosSelecionados
                      .map(id => ministerios.find(m => m.idExterno === id)?.nome)
                      .filter(Boolean)
                      .join(", ")
                    : "Selecione..."}
                </button>

                {dropdownAberto && (
                  <div className="absolute mt-1 w-[500px] bg-white shadow-lg border border-icf-primary-200 rounded-lg max-h-64 overflow-y-auto z-50 p-2">
                    {ministerios?.map(m => (
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
            <div className="grid grid-cols-3 gap-6 items-end">
              <div>
                <label className="text-sm font-medium text-icf-primary-400">Data</label>
                <input
                  type="datetime-local"
                  className="mt-1.5 w-full text-sm placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
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

              <div>
                <label className="text-sm font-medium text-icf-primary-400">Fim</label>
                <input
                  type="datetime-local"
                  className="mt-1.5 w-full text-sm placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                  name="dataHoraFim"
                  value={formData.dataHoraFim}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, dataHoraFim: value }));
                  }}
                />
              </div>

              <div className="flex items-center gap-3 pb-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-icf-primary-300">
                  <input
                    type="checkbox"
                    checked={formData.recorrencia.tipoRecorrencia !== "NAO_REPETE"}
                    onChange={() => setShowRecorrente(true)}
                    className="w-4 h-4 accent-success-500 cursor-pointer"
                  />
                  Tornar Recorrente
                </label>
              </div>
            </div>

            {/* Custo / Local */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-icf-primary-400">Valor do ingresso</label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  className="mt-1.5 w-full text-sm placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-icf-primary-400">Local</label>
                <button
                  type="button"
                  onClick={() => setModalLocalAberto(true)}
                  className="mt-1.5 w-full text-left text-sm text-icf-primary-300 bg-surface-50 border border-icf-primary-100 hover:border-icf-primary-200 rounded-lg py-3 px-4 flex items-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-icf-primary-200" />
                  {endereco?.apelido || "Adicionar local"}
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-sm font-medium text-icf-primary-400">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva o evento..."
                className="mt-1.5 w-full text-sm placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg py-3 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors resize-none"
              />
            </div>

            {/* Ação de exclusão (apenas em modo edição) */}
            {modoEdicao && (
              <div className="flex justify-end mt-4 pt-4 border-t border-icf-primary-100">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={abrirModalExclusao}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Evento
                </Button>
              </div>
            )}
          </form>
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
      {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
    </div>
  );
}