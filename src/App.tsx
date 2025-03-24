import './App.css';
import { Canvas2D } from './components/Canvas2D';
import { Scene2D } from './components/Scene2D';
import { DebugPanel } from './components/DebugPanel';
import { useReefStore } from './store/useReefStore';

function App() {
  const store = useReefStore();
  const { lastGotoPublished, connected, address } = store();

  const debugPanelProps = {
    address,
    connected,
    lastGotoPublished,
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full h-full flex flex-col">
        <div className="flex-grow">
          <Canvas2D>
            <Scene2D />
          </Canvas2D>
        </div>
      </div>
      <DebugPanel {...debugPanelProps} />
    </div>
  );
}

export default App;
