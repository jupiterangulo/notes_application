import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Building2, 
  FolderKanban, 
  Layers, 
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  Search
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    customers, 
    projects, 
    workstreams, 
    notes, 
    selectedNoteId, 
    setSelectedNoteId,
    addCustomer,
    addProject,
    addWorkstream,
    addNote
  } = useStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addingTo, setAddingTo] = useState<{ id: string | 'root', type: 'customer' | 'project' | 'workstream' | 'note' } | null>(null);
  const [inputValue, setInputValue] = useState('');

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || !addingTo) {
      setAddingTo(null);
      setInputValue('');
      return;
    }

    const name = inputValue.trim();
    if (addingTo.type === 'customer') addCustomer(name);
    else if (addingTo.type === 'project') addProject(addingTo.id, name);
    else if (addingTo.type === 'workstream') addWorkstream(addingTo.id, name);
    else if (addingTo.type === 'note') addNote(addingTo.id, name);

    setAddingTo(null);
    setInputValue('');
    if (addingTo.id !== 'root') setExpanded(prev => ({ ...prev, [addingTo.id]: true }));
  };

  return (
    <aside className="sidebar">
      <div className="header" style={{ borderBottom: 'none', background: 'transparent' }}>
        <h2 className="title" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Enterprise Notes</h2>
        <button className="nav-item" onClick={() => setAddingTo({ id: 'root', type: 'customer' })} style={{ padding: '8px' }}>
          <Plus size={18} />
        </button>
      </div>

      {addingTo?.id === 'root' && (
        <div style={{ padding: '0 1rem 1rem' }}>
          <input 
            autoFocus
            className="glass-card"
            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '8px', outline: 'none' }}
            placeholder="New Customer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            onBlur={() => setAddingTo(null)}
          />
        </div>
      )}

      <div className="search-bar" style={{ padding: '0 1rem 1rem' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px 12px',
          gap: '8px'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontSize: '0.9rem',
              outline: 'none',
              width: '100%'
            }} 
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        {customers.map(customer => (
          <div key={customer.id} className="nav-group">
            <div 
              className="nav-item" 
              onClick={() => toggleExpanded(customer.id)}
              style={{ justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={16} />
                <span style={{ fontWeight: 500 }}>{customer.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setAddingTo({ id: customer.id, type: 'project' }); }}>
                  <Plus size={14} />
                </button>
                <div onClick={() => toggleExpanded(customer.id)} style={{ display: 'flex', alignItems: 'center' }}>
                  {expanded[customer.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </div>
            </div>

            {addingTo?.id === customer.id && addingTo.type === 'project' && (
              <div style={{ marginLeft: '2rem', marginBottom: '8px' }}>
                <input 
                  autoFocus
                  style={{ width: '90%', padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '4px', outline: 'none', fontSize: '0.9rem' }}
                  placeholder="New Project..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  onBlur={() => setAddingTo(null)}
                />
              </div>
            )}

            {expanded[customer.id] && projects.filter(p => p.customerId === customer.id).map(project => (
              <div key={project.id} style={{ marginLeft: '1rem' }}>
                <div 
                  className="nav-item" 
                  onClick={() => toggleExpanded(project.id)}
                  style={{ justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FolderKanban size={15} />
                    <span>{project.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setAddingTo({ id: project.id, type: 'workstream' }); }}>
                      <Plus size={14} />
                    </button>
                    <div onClick={() => toggleExpanded(project.id)} style={{ display: 'flex', alignItems: 'center' }}>
                      {expanded[project.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </div>
                </div>

                {addingTo?.id === project.id && addingTo.type === 'workstream' && (
                  <div style={{ marginLeft: '1.5rem', marginBottom: '8px' }}>
                    <input 
                      autoFocus
                      style={{ width: '85%', padding: '5px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
                      placeholder="New Workstream..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      onBlur={() => setAddingTo(null)}
                    />
                  </div>
                )}

                {expanded[project.id] && workstreams.filter(w => w.projectId === project.id).map(workstream => (
                  <div key={workstream.id} style={{ marginLeft: '1rem' }}>
                    <div 
                      className="nav-item" 
                      onClick={() => toggleExpanded(workstream.id)}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Layers size={14} />
                        <span style={{ fontSize: '0.9rem' }}>{workstream.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setAddingTo({ id: workstream.id, type: 'note' }); }}>
                          <Plus size={14} />
                        </button>
                        <div onClick={() => toggleExpanded(workstream.id)} style={{ display: 'flex', alignItems: 'center' }}>
                          {expanded[workstream.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                      </div>
                    </div>

                    {addingTo?.id === workstream.id && addingTo.type === 'note' && (
                      <div style={{ marginLeft: '1rem', marginBottom: '8px' }}>
                        <input 
                          autoFocus
                          style={{ width: '80%', padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '4px', outline: 'none', fontSize: '0.8rem' }}
                          placeholder="Note Title..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                          onBlur={() => setAddingTo(null)}
                        />
                      </div>
                    )}

                    {expanded[workstream.id] && notes.filter(n => n.workstreamId === workstream.id).map(note => (
                      <div 
                        key={note.id} 
                        className={`nav-item ${selectedNoteId === note.id ? 'active' : ''}`}
                        onClick={() => setSelectedNoteId(note.id)}
                        style={{ marginLeft: '1.2rem', padding: '6px 12px' }}
                      >
                        <FileText size={14} />
                        <span style={{ fontSize: '0.85rem' }}>{note.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};
