import "./Calendario.css";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ModalVisualizarEvento } from "../../molecules/ICF/ModalVisualizarEvento.jsx";
import { buscarEventoPorId, buscarEventos } from "../../../services/eventos.js";
import { useAuth } from "../../../routes/AuthContext.jsx";
import { AlertModal } from "../../ui/AlertModal";

export function Calendario() {
  const [events, setEvents] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [modal, setModalErro] = useState(null);
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { menuAberto } = useOutletContext();

  useEffect(() => {

    const timer = setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, 310);
    return () => clearTimeout(timer);

  }, [menuAberto]);

  // 🔹 Carrega eventos da API ao montar o componente
  useEffect(() => {
    async function carregar() {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();

      const res = await buscarEventos(mesAtual, anoAtual);

      if (!res?.eventosMes) return;

      const eventosFormatados = res.eventosMes.map(ev => ({
        id: ev.idExterno,
        title: ev.nome,
        start: ev.dataHoraInicio,
        end: ev.dataHoraFim,
        extendedProps: {
        }
      }));
      setEvents(eventosFormatados);
    }

    carregar();
  }, []);

  const handleEditarEvento = (idEvento) => {
    navigate(`/eventos/editar/${idEvento}`);
  };

  // ---------- CONTROLE DE NAVEGAÇÃO NO CALENDÁRIO ----------
  const handleToday = () => calendarRef.current?.getApi()?.today();
  const handlePrev = () => calendarRef.current?.getApi()?.prev();
  const handleNext = () => calendarRef.current?.getApi()?.next();

  // ---------- ATUALIZAÇÃO DO TÍTULO (Mês Atual) ----------
  const renderTitle = (date) => {
    return date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
  };

  const [currentTitle, setCurrentTitle] = useState(() =>
    renderTitle(new Date())
  );

  const handleDatesSet = async (arg) => {
    setCurrentTitle(renderTitle(arg.view.currentStart));

    const dataAtual = arg.view.currentStart;

    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();

    const res = await buscarEventos(mes, ano);

    if (!res?.eventosMes) return;

    const eventosFormatados = res.eventosMes.map(ev => ({
      id: ev.idExterno,
      title: ev.nome,
      start: ev.dataHoraInicio,
      end: ev.dataHoraFim,
    }));

    setEvents(eventosFormatados);
  };

  return (
    <div className="h-full w-full bg-white p-4">
      {/* ---------- BARRA SUPERIOR ---------- */}
      <div className="flex items-center justify-between mb-2.5">
        {/* Navegação e título */}
        <div className="flex items-center gap-5 ml-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 rounded text-sm text-icf-primary-300 hover:bg-icf-primary-100"
          >
            Hoje
          </button>

          <button onClick={handlePrev} className="px-2 py-1 rounded w-6 h-6">
            <img src="/seta.png" alt="Anterior" />
          </button>

          <button
            onClick={handleNext}
            className="px-2 py-1 rounded rotate-180 w-6 h-6"
          >
            <img src="/seta.png" alt="Próximo" />
          </button>

          <div className="ml-5 font-bold text-2xl text-icf-primary-300 capitalize">
            {currentTitle}
          </div>
        </div>

        {/* Botão Adicionar evento */}
        <div>
          <button
            onClick={() => navigate("/eventos/novo")}
            disabled={user.cargo === "MEMBRO"}
            className={`px-8 py-3 rounded flex gap-2
              ${user.cargo === "MEMBRO"
                ? "bg-icf-primary-200 text-icf-primary-300 cursor-not-allowed"
                : "bg-icf-primary-400 text-xs text-white"
              }`}
          >
            <span>Adicionar Evento +</span>
          </button>
        </div>
      </div>

      {/* ---------- CALENDÁRIO ---------- */}
      <div className="rounded">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={false}
          datesSet={handleDatesSet}
          height="auto"
          locale="pt-br"
          dayHeaderFormat={{ weekday: "long" }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}

          eventClick={async (info) => {
            const idEvento = info.event.id;

            const eventoCompleto = await buscarEventoPorId(idEvento);

            if (!eventoCompleto) {
              setModalErro({
                type: "error",
                title: "Ocorreu um problema",
                message: "Erro ao carregar detalhes do evento."
              });
              return;
            }

            const evento = {
              id: idEvento,
              titulo: eventoCompleto.nome,
              descricao: eventoCompleto.descricao,
              dataInicio: eventoCompleto.dataHoraInicio,
              dataFim: eventoCompleto.dataHoraFim,
              horaInicio: new Date(eventoCompleto.dataHoraInicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              horaFim: new Date(eventoCompleto.dataHoraFim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              local: eventoCompleto?.enderecoEvento?.apelido || "Sem local",
              ministerios: eventoCompleto?.fkMinisterios || [],
              custo: eventoCompleto?.custo || 0,
              organizador: eventoCompleto?.organizador?.nome,
              publicoAlvo: eventoCompleto?.publicoAlvo || "",
            };

            setEventoSelecionado(evento);
            setIsViewModalOpen(true);
          }}

          eventContent={(arg) => (
            <div className="bg-icf-primary-100 text-icf-primary-600 rounded-lg px-1.5 py-1 w-full flex gap-2">
              <div className="bg-icf-primary-400 w-1 rounded-full"></div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-medium">{arg.event.title}</span>
                {arg.timeText && (
                  <span className="text-xs text-gray-600">{arg.timeText}</span>
                )}
              </div>
            </div>
          )}
        />
      </div>

      {/* ---------- MODAL VISUALIZAR EVENTO ---------- */}
      {isViewModalOpen && eventoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ModalVisualizarEvento
            evento={eventoSelecionado}
            onClose={() => setIsViewModalOpen(false)}
            onEdit={() => handleEditarEvento(eventoSelecionado.id)}
          />
        </div>
      )}

      {/* ---------- ALERT MODAL ---------- */}
      {modal && <AlertModal {...modal} onClose={() => setModalErro(null)} />}
    </div>
  );
}
