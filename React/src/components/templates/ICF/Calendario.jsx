import "./Calendario.css";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ModalVisualizarEvento } from "../../molecules/ICF/ModalVisualizarEvento.jsx";

export function Calendario() {
  const [events, setEvents] = useState([]); // Lista de eventos do calendário
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Controle do modal de visualização
  const [eventoSelecionado, setEventoSelecionado] = useState(null); // Evento selecionado no clique
  const calendarRef = useRef(null); // Referência para manipular o calendário diretamente
  const navigate = useNavigate();

  // 🔹 Carrega eventos da API ao montar o componente
  useEffect(() => {
    axios
      .get("http://localhost:3000/eventos")
      .then((res) => {
        const eventosFormatados = res.data.map((ev) => ({
          id: ev.id,
          title: ev.titulo,
          start: `${ev.dataInicio}T${ev.horaInicio || "00:00"}`,
          end: `${ev.dataInicio}T${ev.horaFim || "00:00"}`,
          extendedProps: {
            descricao: ev.descricao,
            local: ev.local,
          },
        }));
        setEvents(eventosFormatados);
      })
      .catch((err) => console.error("Erro ao carregar eventos", err));
  }, []);

  // 🔹 Redireciona para a tela de edição
  const handleEditarEvento = (idEvento) => {
    navigate(`/eventos/editar/${idEvento}`);
  };

  // ---------- CONTROLE DE NAVEGAÇÃO NO CALENDÁRIO ----------
  const handleToday = () => calendarRef.current?.getApi()?.today();
  const handlePrev = () => calendarRef.current?.getApi()?.prev();
  const handleNext = () => calendarRef.current?.getApi()?.next();

  // ---------- ATUALIZAÇÃO DO TÍTULO (Mês Atual) ----------
  const renderTitle = (date) => {
    if (!date) return "";
    try {
      return date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    } catch {
      return "";
    }
  };

  const [currentTitle, setCurrentTitle] = useState(() =>
    renderTitle(new Date())
  );

  const handleDatesSet = (arg) => {
    setCurrentTitle(renderTitle(arg.start));
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
            <img src="/public/seta.png" alt="Anterior" />
          </button>

          <button
            onClick={handleNext}
            className="px-2 py-1 rounded rotate-180 w-6 h-6"
          >
            <img src="/public/seta.png" alt="Próximo" />
          </button>

          <div className="ml-5 font-bold text-2xl text-icf-primary-300 capitalize">
            {currentTitle}
          </div>
        </div>

        {/* Botão Adicionar evento */}
        <div>
          <button
            onClick={() => navigate("/eventos/novo")}
            className="px-8 py-3 rounded bg-icf-primary-400 text-xs text-white flex gap-2"
          >
            <span>Adicionar</span>
            <img className="w-2" src="/public/adicao.svg" alt="Adicionar" />
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
          eventClick={(info) => {
            const evento = {
              id: info.event.id,
              titulo: info.event.title,
              descricao: info.event.extendedProps.descricao || "",
              local: info.event.extendedProps.local || "",
              dataInicio: info.event.startStr,
              dataFim: info.event.endStr,
              horaInicio: info.event.start
                ? info.event.start.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              horaFim: info.event.end
                ? info.event.end.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            };
            setEventoSelecionado(evento);
            setIsViewModalOpen(true);
          }}
          eventContent={(arg) => (
            <div className="bg-icf-primary-100 text-icf-primary-600 rounded-lg px-1.5 py-1 w-full flex gap-2">
              <div className="bg-icf-primary-400 w-1 rounded-full"></div>
              <div className="flex flex-col">
                <span className="font-medium">{arg.event.title}</span>
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
    </div>
  );
}
