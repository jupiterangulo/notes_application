import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { Calendar, Users, Clock, MapPin, FileText } from 'lucide-react';

const MeetingComponent = ({ node, updateAttributes }: any) => {
  return (
    <NodeViewWrapper className="meeting-block glass-card" style={{ padding: '20px', margin: '20px 0', borderLeft: '4px solid var(--accent-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '8px' }}>
          <Users size={20} color="white" />
        </div>
        <input
          type="text"
          value={node.attrs.title}
          onChange={(e) => updateAttributes({ title: e.target.value })}
          placeholder="Meeting Title"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            outline: 'none',
            width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Calendar size={16} />
          <input
            type="date"
            value={node.attrs.date}
            onChange={(e) => updateAttributes({ date: e.target.value })}
            style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Clock size={16} />
          <input
            type="time"
            value={node.attrs.time}
            onChange={(e) => updateAttributes({ time: e.target.value })}
            style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <MapPin size={16} />
          <input
            type="text"
            value={node.attrs.location}
            onChange={(e) => updateAttributes({ location: e.target.value })}
            placeholder="Location"
            style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <Users size={14} /> Attendees
        </label>
        <textarea
          value={node.attrs.attendees}
          onChange={(e) => updateAttributes({ attendees: e.target.value })}
          placeholder="Add attendees..."
          style={{ 
            width: '100%', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '6px', 
            padding: '8px', 
            color: 'var(--text-primary)',
            minHeight: '60px',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <FileText size={14} /> Agenda & Notes
        </label>
        <textarea
          value={node.attrs.notes}
          onChange={(e) => updateAttributes({ notes: e.target.value })}
          placeholder="Meeting agenda and discussion notes..."
          style={{ 
            width: '100%', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '6px', 
            padding: '8px', 
            color: 'var(--text-primary)',
            minHeight: '120px',
            resize: 'vertical'
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const MeetingBlock = Node.create({
  name: 'meetingBlock',
  group: 'block',
  content: '',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: { default: '' },
      date: { default: new Date().toISOString().split('T')[0] },
      time: { default: '12:00' },
      location: { default: '' },
      attendees: { default: '' },
      notes: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="meeting-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'meeting-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MeetingComponent);
  },
});
