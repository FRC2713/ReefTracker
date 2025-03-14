import { useCallback, useContext, useEffect, useState } from 'react';
import './App.css';
import { NT4Context } from './util/nt4-manager.ts';
import { Canvas2D } from './components/Canvas2D';
import { Scene2D } from './components/Scene2D';
import { DebugPanel } from './components/DebugPanel';

export type BranchAddress = {
  level: number;
  index: number;
};

function App() {
  const [currentTarget, setCurrentTarget] = useState<BranchAddress | null>(
    null
  );

  const [lastGotoPublished, setLastGotoPublished] = useState<string>('none');

  const nt4manager = useContext(NT4Context);

  // These handlers are currently unused but kept for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCurrentTargetClick = useCallback(
    (target: BranchAddress | null) => {
      if (!target) {
        setCurrentTarget(null);
        setLastGotoPublished('none');
        nt4manager.publishNewGoTo('none');
        return;
      }
      const gotoString =
        target.index.toString() + ',' + target.level.toString();
      if (gotoString !== lastGotoPublished) {
        nt4manager.publishNewGoTo(gotoString);
        setLastGotoPublished(gotoString);
      }
      setCurrentTarget(target);
    },
    [nt4manager, lastGotoPublished]
  );

  const [connected, setConnected] = useState(nt4manager.connected);
  const [address, setAddress] = useState(nt4manager.address)
  useEffect(() => {
    // Subscribe to connection state changes
    const unsubscribe = nt4manager.onConnectionChange((connected) => {
      setConnected(connected);
      setAddress(nt4manager.address)
    }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [nt4manager]);

  console.log('currentTarget', currentTarget);

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full h-full flex flex-col">
        <div className="flex-grow">
          <Canvas2D>
            <Scene2D
              gridSize={10}
              gridDivisions={10}
              onBranchClick={handleCurrentTargetClick}
              currentTarget={currentTarget}
            />
          </Canvas2D>
        </div>
      </div>
      <DebugPanel address={address} connected={connected} lastGotoPublished={lastGotoPublished} />
    </div>
  );
}

export default App;
