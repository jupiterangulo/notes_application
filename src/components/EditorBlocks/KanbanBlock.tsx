import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { Plus, ChevronRight, ChevronLeft, Trash2, Layout, X } from 'lucide-react';

const KanbanComponent = ({ node, updateAttributes }: any) => {
  const columns = node.attrs.columns || [
    { id: 'todo', title: 'To Do', cards: [] },
    { id: 'in-progress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] }
  ];

  const addColumn = () => {
    const title = prompt('Enter column title:');
    if (!title) return;
    const newCol = { id: Math.random().toString(36).substr(2, 9), title, cards: [] };
    updateAttributes({ columns: [...columns, newCol] });
  };

  const removeColumn = (colId: string) => {
    if (columns.length <= 1) return;
    if (!confirm('Are you sure you want to delete this column and all its cards?')) return;
    updateAttributes({ columns: columns.filter((c: any) => c.id !== colId) });
  };

  const addCard = (colId: string) => {
    const text = prompt('Enter card title:');
    if (!text) return;

    const newColumns = columns.map((col: any) => {
      if (col.id === colId) {
        return { ...col, cards: [...col.cards, { id: Math.random().toString(36).substr(2, 9), text }] };
      }
      return col;
    });
    updateAttributes({ columns: newColumns });
  };

  const moveCard = (cardId: string, fromColId: string, direction: 'left' | 'right') => {
    const colIndex = columns.findIndex((c: any) => c.id === fromColId);
    const nextColIndex = direction === 'right' ? colIndex + 1 : colIndex - 1;

    if (nextColIndex < 0 || nextColIndex >= columns.length) return;

    const card = columns[colIndex].cards.find((c: any) => c.id === cardId);
    const newColumns = columns.map((col: any, idx: number) => {
      if (idx === colIndex) {
        return { ...col, cards: col.cards.filter((c: any) => c.id !== cardId) };
      }
      if (idx === nextColIndex) {
        return { ...col, cards: [...col.cards, card] };
      }
      return col;
    });
    updateAttributes({ columns: newColumns });
  };

  const deleteCard = (cardId: string, colId: string) => {
    const newColumns = columns.map((col: any) => {
      if (col.id === colId) {
        return { ...col, cards: col.cards.filter((c: any) => c.id !== cardId) };
      }
      return col;
    });
    updateAttributes({ columns: newColumns });
  };

  return (
    <NodeViewWrapper className="kanban-block glass-card" style={{ padding: '20px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layout size={20} color="var(--accent-secondary)" />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Kanban Board</h3>
        </div>
        <button 
          onClick={addColumn}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '6px 12px', 
            background: 'var(--accent-gradient)', 
            border: 'none', 
            borderRadius: '6px', 
            color: 'white', 
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={14} /> Add Column
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', minWidth: 'fit-content' }}>
        {columns.map((col: any) => (
          <div key={col.id} style={{ width: '280px', flexShrink: 0, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {col.title} <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>{col.cards.length}</span>
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => addCard(col.id)} className="icon-btn"><Plus size={16} /></button>
                <button onClick={() => removeColumn(col.id)} className="icon-btn" style={{ color: '#ef4444' }}><X size={16} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.cards.map((card: any) => (
                <div key={card.id} className="glass-card" style={{ padding: '12px', fontSize: '0.9rem' }}>
                  <div style={{ marginBottom: '10px' }}>{card.text}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button onClick={() => deleteCard(card.id, col.id)} className="icon-btn" style={{ color: '#ef4444' }}><Trash2 size={12} /></button>
                    <button onClick={() => moveCard(card.id, col.id, 'left')} className="icon-btn"><ChevronLeft size={14} /></button>
                    <button onClick={() => moveCard(card.id, col.id, 'right')} className="icon-btn"><ChevronRight size={14} /></button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addCard(col.id)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  background: 'transparent', 
                  border: '1px dashed var(--border-color)', 
                  borderRadius: '6px', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                + Add Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};

export const KanbanBlock = Node.create({
  name: 'kanbanBlock',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      columns: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="kanban-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'kanban-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KanbanComponent);
  },
});
