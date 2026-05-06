import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  type Edge, 
  type Node,
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store/useStore';
import { Network, X } from 'lucide-react';

export const GraphView: React.FC = () => {
  const { notes, setViewMode, setSelectedNoteId } = useStore();

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = notes.map((note, index) => ({
      id: note.id,
      data: { label: note.title },
      position: { x: Math.cos(index) * 300 + 400, y: Math.sin(index) * 300 + 300 },
      style: { 
        background: 'rgba(59, 130, 246, 0.1)', 
        color: '#f3f4f6', 
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        width: 150,
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Outfit, sans-serif'
      }
    }));

    const edges: Edge[] = [];
    notes.forEach(note => {
      note.links.forEach(linkId => {
        edges.push({
          id: `e-${note.id}-${linkId}`,
          source: note.id,
          target: linkId,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
        });
      });
    });

    return { nodes, edges };
  }, [notes]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNoteId(node.id);
    setViewMode('editor');
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Network size={20} color="var(--accent-primary)" />
          <h2 className="title" style={{ fontSize: '1rem', margin: 0 }}>Note Link Tree</h2>
        </div>
        <button 
          onClick={() => setViewMode('editor')}
          className="toolbar-btn glass-card"
          style={{ padding: '10px' }}
        >
          <X size={20} />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#333" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
