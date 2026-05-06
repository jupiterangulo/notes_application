import { Sidebar } from './components/Sidebar';
import { NotesEditor } from './components/Editor';
import { GraphView } from './components/GraphView';
import { useStore } from './store/useStore';
import './styles/main.css';

const App: React.FC = () => {
  const { viewMode } = useStore();

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {viewMode === 'editor' ? <NotesEditor /> : <GraphView />}
      </main>
    </div>
  );
};

export default App;
