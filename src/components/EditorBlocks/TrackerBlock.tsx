import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { Target, Plus, Trash2 } from 'lucide-react';

const TrackerComponent = ({ node, updateAttributes }: any) => {
  const { title, tasks = [] } = node.attrs;

  const addTask = () => {
    const newTask = { id: Math.random().toString(36).substr(2, 9), title: 'New Task', progress: 0, status: 'To Do' };
    updateAttributes({ tasks: [...tasks, newTask] });
  };

  const updateTask = (id: string, updates: any) => {
    const newTasks = tasks.map((t: any) => t.id === id ? { ...t, ...updates } : t);
    updateAttributes({ tasks: newTasks });
  };

  const removeTask = (id: string) => {
    updateAttributes({ tasks: tasks.filter((t: any) => t.id !== id) });
  };

  const totalProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((acc: number, t: any) => acc + t.progress, 0) / tasks.length)
    : 0;

  return (
    <NodeViewWrapper className="tracker-block glass-card" style={{ padding: '20px', margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={20} color="var(--accent-primary)" />
          <input
            type="text"
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            placeholder="Project Tracker Title"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Progress</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{totalProgress}%</div>
        </div>
      </div>

      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '25px' }}>
        <div 
          style={{ 
            width: `${totalProgress}%`, 
            height: '100%', 
            background: 'var(--accent-gradient)', 
            transition: 'width 0.3s ease' 
          }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tasks.map((task: any) => (
          <div key={task.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1 }}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value })}
                  style={{ background: 'rgba(0,0,0,0.2)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 6px' }}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <button onClick={() => removeTask(task.id)} className="icon-btn" style={{ color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress}
                onChange={(e) => updateTask(task.id, { progress: parseInt(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '0.8rem', minWidth: '35px' }}>{task.progress}%</span>
            </div>
          </div>
        ))}
        <button 
          onClick={addTask}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            padding: '10px', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px dashed var(--border-color)', 
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export const TrackerBlock = Node.create({
  name: 'trackerBlock',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: { default: '' },
      tasks: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="tracker-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'tracker-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TrackerComponent);
  },
});
