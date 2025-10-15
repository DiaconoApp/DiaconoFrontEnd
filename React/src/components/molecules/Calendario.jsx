import './Calendario.css'

import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export function Calendario() {
  // Referência direta para acessar os métodos do calendário
  const calendarRef = useRef(null);

  // 🔹 Estado com eventos locais (mock inicial)
  const [events, setEvents] = useState([
    { id: '1', title: 'Culto de Jovens', start: '2025-10-02T18:00:00' },
    { id: '2', title: 'Reunião de equipe', start: '2025-10-05T14:00:00' }
  ]);

  // 🔹 Controle do modal e evento que está sendo editado
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // guarda { id, title, start, end }

  // ---------- FUNÇÕES DE CONTROLE DE MODAL ----------

  const openModal = (preset = null) => {
    setEditingEvent(preset); // define o evento atual (novo ou existente)
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingEvent(null);
    setModalOpen(false);
  };

  // ---------- CONTROLE DE NAVEGAÇÃO NO CALENDÁRIO ----------

  // Vai para o dia atual
  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
  };

  // Vai para o mês anterior
  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
  };

  // Vai para o próximo mês
  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
  };

  // ---------- INTERAÇÃO COM O CALENDÁRIO ----------

  // Ao clicar em um dia vazio → abre modal para criar evento
  const handleDateClick = (arg) => {
    openModal({ title: '', start: arg.dateStr, end: arg.dateStr });
  };

  // Ao clicar em um evento → abre modal para editar
  const handleEventClick = (arg) => {
    const ev = arg.event;
    openModal({
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr ?? ev.startStr
    });
  };

  // ---------- CRUD DE EVENTOS (Local) ----------

  // Salva (novo ou edição) evento no estado local
  const handleSaveEvent = (e) => {
    e.preventDefault();
    const form = e.target;

    const id = form.id.value || String(Date.now());
    const title = form.title.value;
    const start = form.start.value;
    const end = form.end.value || start;

    const payload = { id, title, start, end };

    // Atualiza lista de eventos
    setEvents(prev => {
      const exists = prev.find(ev => ev.id === id);
      return exists
        ? prev.map(ev => (ev.id === id ? payload : ev))
        : [...prev, payload];
    });

    closeModal();
  };

  // Exclui evento pelo id
  const handleDeleteEvent = (id) => {
    if (!window.confirm('Excluir evento?')) return;
    setEvents(prev => prev.filter(ev => ev.id !== id));
    closeModal();
  };

  // ---------- ATUALIZAÇÃO DO TÍTULO (Mês Atual) ----------

  // Função auxiliar para exibir o nome do mês + ano
  const renderTitle = (date) => {
    if (!date) return '';
    try {
      return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // Guarda o título atual (mês/ano)
  const [currentTitle, setCurrentTitle] = useState(() => renderTitle(new Date()));

  // Atualiza título sempre que o calendário muda de período
  const handleDatesSet = (arg) => {
    setCurrentTitle(renderTitle(arg.start));
  };

  return (
    <div className="h-full w-full bg-white p-4">
      {/* ---------- BARRA SUPERIOR ---------- */}
      <div className="flex items-center justify-between mb-2.5">
        {/* Lado esquerdo: navegação e título */}
        <div className="flex items-center gap-5 ml-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 rounded text-sm text-icf-primary-300 hover:bg-icf-primary-100"
          >
            Hoje
          </button>

          <button
            onClick={handlePrev}
            className="px-2 py-1 rounded w-6 h-6"
          >
            <img
              src="/public/seta.png"
              alt="icone de seta, apontada para a esquerda"
            />
          </button>

          <button
            onClick={handleNext}
            className="px-2 py-1 rounded rotate-180"
          >
            <img
              src="/public/seta.png"
              alt="icone de seta, apontada para a direita"
            />
          </button>

          {/* Título com mês e ano atual */}
          <div className="ml-5 font-bold text-2xl text-icf-primary-300 capitalize">
            {currentTitle}
          </div>
        </div>

        {/* Lado direito: botão Adicionar evento */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              openModal({ title: '', start: new Date().toISOString().slice(0, 16) })
            }
            className="px-8 py-3 rounded bg-icf-primary-400 text-xs text-white flex gap-2"
          >
            <span>Adicionar</span>
            <img
              className="w-2"
              src="/public/adicao.svg"
              alt="icone de adição"
            />
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
          headerToolbar={false} // usamos header customizado
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          locale="pt-br"
          dayHeaderFormat={{ weekday: 'long' }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
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

      {/* ---------- MODAL DE EDIÇÃO / ADIÇÃO ---------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-lg w-[480px] max-w-full p-4">
            <h2 className="text-lg font-semibold mb-2">
              {editingEvent?.id ? 'Editar evento' : 'Novo evento'}
            </h2>

            <form onSubmit={handleSaveEvent}>
              <input
                type="hidden"
                name="id"
                defaultValue={editingEvent?.id ?? ''}
              />

              {/* Campo Título */}
              <label className="block mb-2">
                <div className="text-sm text-gray-600">Título</div>
                <input
                  name="title"
                  defaultValue={editingEvent?.title ?? ''}
                  required
                  className="mt-1 w-full border rounded px-2 py-1"
                />
              </label>

              {/* Campo Início */}
              <label className="block mb-2">
                <div className="text-sm text-gray-600">Início</div>
                <input
                  name="start"
                  type="datetime-local"
                  defaultValue={
                    editingEvent?.start
                      ? editingEvent.start.replace(' ', 'T').slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                  className="mt-1 w-full border rounded px-2 py-1"
                />
              </label>

              {/* Campo Fim */}
              <label className="block mb-4">
                <div className="text-sm text-gray-600">Fim (opcional)</div>
                <input
                  name="end"
                  type="datetime-local"
                  defaultValue={
                    editingEvent?.end
                      ? editingEvent.end.replace(' ', 'T').slice(0, 16)
                      : ''
                  }
                  className="mt-1 w-full border rounded px-2 py-1"
                />
              </label>

              {/* Botões do modal */}
              <div className="flex justify-end gap-2">
                {editingEvent?.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Excluir
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 rounded border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-blue-600 text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
