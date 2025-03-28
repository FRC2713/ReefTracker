import './App.css';
import { Canvas2D } from './components/Canvas2D';
import { DebugPanel } from './components/DebugPanel';

function App() {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full h-full flex flex-col">
        <div className="flex-grow">
          <Canvas2D />
        </div>
      </div>
      <DebugPanel />
    </div>
  );
}

export default App;
