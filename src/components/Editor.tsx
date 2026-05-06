import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useStore } from '../store/useStore';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Table as TableIcon, 
  ExternalLink,
  Plus,
  FileText,
  Network,
  Users,
  Target,
  Calendar as CalendarIcon,
  Layout
} from 'lucide-react';

// Custom Blocks
import { MeetingBlock } from './EditorBlocks/MeetingBlock';
import { TrackerBlock } from './EditorBlocks/TrackerBlock';
import { CalendarBlock } from './EditorBlocks/CalendarBlock';
import { KanbanBlock } from './EditorBlocks/KanbanBlock';

const MenuBar = ({ editor }: { editor: TipTapEditor | null }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar" style={{ 
      display: 'flex', 
      gap: '8px', 
      padding: '10px', 
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(255,255,255,0.02)',
      flexWrap: 'wrap'
    }}>
      <button 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
      <button 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
      <button 
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
        className="toolbar-btn"
        title="Insert Table"
      >
        <TableIcon size={18} />
      </button>
      
      <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
      
      <button 
        onClick={() => editor.chain().focus().insertContent({ type: 'meetingBlock' }).run()} 
        className="toolbar-btn"
        title="Meeting Block"
      >
        <Users size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().insertContent({ type: 'trackerBlock' }).run()} 
        className="toolbar-btn"
        title="Tracker Block"
      >
        <Target size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().insertContent({ type: 'calendarBlock' }).run()} 
        className="toolbar-btn"
        title="Calendar Block"
      >
        <CalendarIcon size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().insertContent({ type: 'kanbanBlock' }).run()} 
        className="toolbar-btn"
        title="Kanban Block"
      >
        <Layout size={18} />
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <button className="toolbar-btn" title="Link Reference">
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export const NotesEditor: React.FC = () => {
  const { selectedNoteId, notes, updateNoteContent } = useStore();
  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      MeetingBlock,
      TrackerBlock,
      CalendarBlock,
      KanbanBlock,
    ],
    content: selectedNote?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedNoteId) {
        updateNoteContent(selectedNoteId, editor.getHTML());
      }
    },
  }, [selectedNoteId]);

  if (!selectedNote) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Select a note or create one to start writing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MenuBar editor={editor} />
      <div className="header" style={{ padding: '0 2rem', borderBottom: '1px solid var(--border-color)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText size={18} color="var(--accent-primary)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {selectedNote.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              const targetTitle = prompt('Enter note title to link:');
              const targetNote = notes.find(n => n.title === targetTitle);
              if (targetNote && selectedNoteId) {
                useStore.getState().linkNotes(selectedNoteId, targetNote.id);
                alert('Notes linked successfully!');
              } else {
                alert('Note not found.');
              }
            }}
            className="toolbar-btn glass-card"
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
          >
            <ExternalLink size={14} /> Link Note
          </button>
          <button 
            onClick={() => useStore.getState().setViewMode('graph')}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
          >
            <Network size={14} /> View Link Tree
          </button>
        </div>
      </div>
      <div className="editor-container">
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 700 }}>
          {selectedNote.title}
        </h1>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

