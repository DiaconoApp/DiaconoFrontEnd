import { useState, useEffect } from "react";
import { Menu } from "../../templates/ICF/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { ModalExclusao } from "./ModalExclusao";
import { ModalExclusaoRecorrencia } from "./ModalExclusaoRecorrencia";
import { ModalLocal1 } from "./ModalLocal1";
import { transformationName } from "../../../utils/Utils";
import { buscarEventoPorId, criarEvento, deletarEventoMultiplos, deletarEventoUnico, editarEvento } from "../../../services/eventos";
import { ModalRecorrente } from "./ModalRecorrente";

export function FormEventos() {

  const navigate = useNavigate();
  const { idEvento } = useParams();
  const modoEdicao = Boolean(idEvento);

  const [menuAberto, setMenuAberto] = useState(true);
  const [nome, setNome] = useState("");
  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
  const [isModalExcluirRecorrenciaOpen, setIsModalExcluirRecorrenciaOpen] = useState(false);

  function abrirModalExclusao() {
    const isRecorrente = Boolean(formData?.recorrencia && formData.recorrencia.tipoRecorrencia !== "NAO_REPETE");

    if (isRecorrente) {
      setIsModalExcluirRecorrenciaOpen(true);
    } else {
      setIsModalExcluirOpen(true);
    }
  }

  async function confirmarExcluirUnico() {
    try {
      await deletarEventoUnico(idEvento);
      alert("Evento excluído com sucesso!");
      setIsModalExcluirOpen(false);
      navigate("/eventos");
      atualizarCalendario(); // recarrega eventos
    } catch (error) {
      alert("Erro ao excluir evento");
    }
  }

  const [opcaoRecorrencia, setOpcaoRecorrencia] = useState("unico");

  async function confirmarExcluirRecorrencia() {
    try {
      if (opcaoRecorrencia === "unico") {
        await deletarEventoUnico(idEvento);
      } else {
        await deletarEventoMultiplos(idEvento);
      }

      alert("Evento excluído!");
      setIsModalExcluirRecorrenciaOpen(false);
      fecharModal();
      atualizarCalendario();

    } catch (error) {
      alert("Erro ao excluir evento");
    }
  }

  // Dados do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    publico: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    valor: "",
    localId: "",
    descricao: "",
    recorrencia: {
      tipoRecorrencia: "NAO_REPETE",
      dataInicioRecorrencia: "",
      dataTerminoRecorrencia: ""
    }
  });


  const [isModalRecorrencia, setShowRecorrente] = useState(false);
  const [endereco, setEndereco] = useState(null);
  const [modalLocalAberto, setModalLocalAberto] = useState(false);


  useEffect(() => {
    const nomeSalvo = localStorage.getItem("nome");
    if (nomeSalvo) setNome(nomeSalvo);
  }, []);


  useEffect(() => {
    if (modoEdicao) {
      buscarEventoPorId(idEvento).then(evento => {
        setFormData({
          nome: evento.nome,
          descricao: evento.descricao,
          publicoAlvo: evento.publicoAlvo,
          dataHoraInicio: evento.dataHoraInicio,
          dataHoraFim: evento.dataHoraFim,
          custo: evento.custo,
          recorrencia: {
            tipoRecorrencia: evento.recorrencia.tipoRecorrencia,
            dataInicioRecorrencia: evento.recorrencia.dataInicioRecorrencia,
            dataTerminoRecorrencia: evento.recorrencia.dataTerminoRecorrencia
          }
        });
        setEndereco({
            idExterno: evento?.enderecoEvento?.idExterno || null,
            cep: evento?.enderecoEvento?.cep,
            // estado: evento?.enderecoEvento?.estado,
            cidade: evento?.enderecoEvento?.cidade,
            bairro: evento?.enderecoEvento?.bairro,
            rua: evento?.enderecoEvento?.rua,
            complemento: evento?.enderecoEvento?.complemento,
            numero: evento?.enderecoEvento?.numero,
            apelido: evento?.enderecoEvento?.apelido
        })
      });
    }
  }, [idEvento]);

  function handleSalvarEndereco(enderecoSalvo) {
    setEndereco(enderecoSalvo);
    console.log("Endereço salvo no formulário:", enderecoSalvo);
    setModalLocalAberto(false);
  }

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
    if (!formData.dataHoraInicio) return "A data do evento é obrigatória.";
    if (!formData.dataHoraFim) return "Informe o horário de início.";
    // if (!formData.horaFim) return "Informe o horário de término.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarFormulario();
    if (erro) return alert(erro);
    
    // DATA E HORA FORMATADAS
    // const inicioISO = `${formData.dataInicio}T${formData.horaInicio}`;
    // const fimISO = `${formData.dataInicio}T${formData.horaFim}`;

    const eventoPayload = {
      nome: formData.titulo,
      descricao: formData.descricao,
      publicoAlvo: formData.publico,
      dataHoraInicio: formData.dataHoraInicio,
      dataHoraFim: formData.dataHoraFim,
      custo: Number(formData.valor),

      fkMinisterios: formData.ministeriosSelecionados,

      endereco: {
        idExterno: endereco.idExterno,
        cep: endereco.cep,
        estado: endereco.estado,
        cidade: endereco.cidade,
        bairro: endereco.bairro,
        rua: endereco.rua,
        complemento: endereco.complemento,
        numero: endereco.numero,
        apelido: endereco.apelido,
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

  return (
    <div className="flex w-full">
      <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      <div className={`bg-[#F6F7F9] flex w-full h-full p-2 transition-all duration-300`}>
        <div className={`bg-white rounded-l-lg p-6 col-span-3 w-full`}>
          <h2 className="text-2xl font-bold tracking-default mb-4">  {modoEdicao ? "Editar Evento" : "Adicionar Evento"} </h2>

          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <label className="text-base text-icf-primary-400">Nome do evento</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.nome}
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
                    value={formData.publicoAlvo}
                    onChange={handleChange}
                    className="mt-1 w-full text-base disabled:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  >
                    <option value="" disabled >Selecione...</option>
                    <option value="Geral">Membros e visitantes</option>
                    <option value="Membros">Membros</option>
                    <option value="Lideranças">Líderes e Pastores</option>
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
                {/* <div className="pb-3">
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
                </div> */}
                <button
                  type="button"
                  className="w-[25%] px-4 py-2.5 rounded-md bg-icf-primary-50 flex justify-center items-center gap-2 text-icf-primary-300 text-base cursor-pointer"
                  onClick={() => setShowRecorrente(true)}
                >
                  <img src="/public/iconeRecorrencia.svg" alt="" className="w-4 h-4" />
                  {formData.recorrencia.tipoRecorrencia === "NAO_REPETE"
                    ? "Tornar recorrente"
                    : "Ajustar recorrência"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-[100%]">
                <div>
                  <label className="text-base text-icf-primary-400">Custo</label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.custo}
                    onChange={handleChange}
                    placeholder="R$ 0,00"
                    className="mt-1 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                  />
                </div>
                <div>
                  <label className="text-base text-icf-primary-400">Local</label>
                  <button
                    type="button" onClick={() => setModalLocalAberto(true)}
                    className="mt-1 w-full text-left text-base placeholder:text-icf-primary-200 text-icf-primary-300  bg-icf-primary-50 rounded-lg py-3 px-4"
                  >
                    {endereco ? "Alterar local" :"Cadastrar local"}
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
                  className="mt-1 h-22 w-full text-base placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 px-4"
                />
              </div>

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
              <div className="text-xs font-semibold text-icf-primary-400"> {transformationName(nome)}</div>
              <div className="text-[10px] tracking-[0.5px] font-light text-icf-primary-300"> Organizador</div>
            </div>
          </div>
        </div>
      </div>
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
            titulo="Excluir evento"
            pergunta="Escolha uma opção"
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
            local={endereco}   // <-- se existir, entra em modo editar
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