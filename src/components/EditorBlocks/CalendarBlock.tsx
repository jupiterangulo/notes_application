import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText, Plus } from 'lucide-react';
import { useState } from 'react';

const CalendarComponent = ({ node, updateAttributes }: any) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateData = node.attrs.dateData || {};

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const updateAgenda = (agenda: string) => {
    if (!selectedDate) return;
    const newData = { ...dateData, [selectedDate]: { ...dateData[selectedDate], agenda } };
    updateAttributes({ dateData: newData });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <NodeViewWrapper className="calendar-block glass-card" style={{ padding: '20px', margin: '20px 0', maxWidth: '600px' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={18} color="var(--accent-primary)" />
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="icon-btn"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="icon-btn"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', paddingBottom: '8px' }}>{day}</div>
            ))}
            {days.map((day, idx) => {
              const dateStr = day.toISOString().split('T')[0];
              const hasData = dateData[dateStr]?.agenda;
              const isSelected = selectedDate === dateStr;
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  style={{
                    padding: '8px 0',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    position: 'relative',
                    color: isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {format(day, 'd')}
                  {hasData && (
                    <div style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', minHeight: '200px' }}>
          {selectedDate ? (
            <div>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Agenda for {format(new Date(selectedDate + 'T12:00:00'), 'MMM d, yyyy')}
              </h4>
              <textarea
                value={dateData[selectedDate]?.agenda || ''}
                onChange={(e) => updateAgenda(e.target.value)}
                placeholder="Add agenda or project notes..."
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  color: 'white', 
                  padding: '10px',
                  fontSize: '0.85rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
              Select a date to view or add agenda
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const CalendarBlock = Node.create({
  name: 'calendarBlock',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      dateData: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="calendar-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'calendar-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalendarComponent);
  },
});
