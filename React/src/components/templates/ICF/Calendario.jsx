import "./Calendario.css";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ModalVisualizarEvento } from "../../molecules/ICF/ModalVisualizarEvento.jsx";
import { buscarEventoPorId, buscarEventos } from "../../../services/eventos.js";
import { useAuth } from "../../../routes/AuthContext.jsx";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../atoms/ICF/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Calendario() {
  const [events, setEvents] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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
        extendedProps: {}
      }));
      setEvents(eventosFormatados);
    }

    carregar();
  }, []);

  const handleEditarEvento = (idEvento) => {
    navigate(`/eventos/editar/${idEvento}`);
  };

  // ---------- CONTROLE DE NAVEGAÇÃO NO CALENDÁRIO ----------
  const handleToday = () => {
    calendarRef.current?.getApi()?.today();
    setSelectedDate(new Date());
  };
  const handlePrev = () => calendarRef.current?.getApi()?.prev();
  const handleNext = () => calendarRef.current?.getApi()?.next();

  // ---------- ATUALIZAÇÃO DO TÍTULO (Mês Atual) ----------
  const renderTitle = (date) => {
    return date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
  };

  const [currentTitle, setCurrentTitle] = useState(() =>
    renderTitle(new Date())
  );

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleDatesSet = async (arg) => {
    const dataAtual = arg.view.currentStart;
    setCurrentTitle(renderTitle(dataAtual));
    setCurrentYear(dataAtual.getFullYear());
    setSelectedDate(dataAtual);

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

  const handleMiniCalendarSelect = (date) => {
    setSelectedDate(date);
    calendarRef.current?.getApi()?.gotoDate(date);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        titulo="Calendário de Eventos"
        descricao="Gerencie todos os eventos da igreja"
        textoBotao="Adicionar"
        acaoPrimaria={() => navigate("/eventos/novo")}
        disabled={user?.cargo === "MEMBRO"}
      >
        <Button
          variant="outline"
          onClick={handleToday}
          className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
        >
          Hoje
        </Button>
      </PageHeader>

      {/* Content */}
      <div className="flex gap-6">
        {/* Main Calendar */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-icf-primary-100 hover:bg-icf-primary-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-icf-primary-300" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-icf-primary-100 hover:bg-icf-primary-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-icf-primary-300" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-icf-primary-400 capitalize">
                {selectedDate.toLocaleString("pt-BR", { month: "long" })} de
              </span>
              <Select value={String(currentYear)} onValueChange={(val) => {
                const newDate = new Date(Number(val), selectedDate.getMonth(), 1);
                calendarRef.current?.getApi()?.gotoDate(newDate);
              }}>
                <SelectTrigger className="w-24 border-icf-primary-100">
                  <SelectValue placeholder={currentYear} />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026, 2027, 2028].map(year => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-20" /> {/* Spacer for balance */}
          </div>

          {/* FullCalendar */}
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
                alert("Erro ao carregar detalhes do evento.");
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
            eventContent={(arg) => {
              // Cores diferentes baseadas no hash do título do evento
              const colors = [
                { bg: 'bg-blue-500', text: 'text-white' },
                { bg: 'bg-green-500', text: 'text-white' },
                { bg: 'bg-orange-500', text: 'text-white' },
                { bg: 'bg-purple-500', text: 'text-white' },
              ];
              
              // Usar hash simples do título para escolher cor consistente
              const hashCode = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                  hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return Math.abs(hash);
              };
              
              const colorIndex = hashCode(arg.event.title) % colors.length;
              const color = colors[colorIndex];
              
              return (
                <div className={`${color.bg} ${color.text} rounded-md px-2 py-1 w-full cursor-pointer hover:opacity-90 transition-opacity`}>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm truncate">{arg.event.title}</span>
                    {arg.timeText && (
                      <span className="text-xs opacity-90">{arg.timeText}</span>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
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
