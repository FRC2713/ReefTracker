import { useCallback, useContext, useEffect, useState } from 'react';
import './App.css';
import { BranchLevel } from './components/BranchLevel';
import { TroughLevel } from './components/TroughLevel';
import { NT4Context } from './util/nt4-manager.ts';
import { columnLabels } from './constants.ts';

type OccupancyMap = number[][];

export type BranchAddress = {
  level: number;
  index: number;
};

function App() {
  const [occupancyMap, setOccupancyMap] = useState<OccupancyMap>([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [currentTarget, setCurrentTarget] = useState<BranchAddress | null>(
    null
  );

  const nt4manager = useContext(NT4Context);

  const handleCurrentTargetClick = useCallback(
    (target: BranchAddress) => {
      console.log('target', target);
      if (
        currentTarget?.level === target.level &&
        currentTarget.index === target.index
      ) {
        setCurrentTarget(null);
        nt4manager.publishNewGoTo('none');
        return;
      }
      nt4manager.publishNewGoTo('none');
      setTimeout(() => {
      nt4manager.publishNewGoTo(
        target.index.toString() + ',' + target.level.toString()
      )}, 100);
      setCurrentTarget(target);
    },
    [currentTarget]
  );

  const handleOccupancyChange = useCallback(
    (level: number, index: number, count: number) => {
      console.log('occupancy change', level, index, count);
      const newOccupancyMap = [...occupancyMap];
      const newLevel = [...newOccupancyMap[level]];
      newLevel[index] = count;
      newOccupancyMap[level] = newLevel;
      setOccupancyMap(newOccupancyMap);
    },
    [occupancyMap]
  );

  const [connected, setConnected] = useState(nt4manager.connected);
  useEffect(() => {
    // Listen to changes in `connected` state
    const interval = setInterval(() => {
      setConnected(nt4manager.connected); // Update state when connected changes
    }, 1000); // Poll every second (or choose a more efficient way)

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [nt4manager]);

  console.log('currentTarget', currentTarget);

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full grid grid-cols-7 gap-4 h-16">
        <div className="text-4xl font-bold flex items-start justify-center h-8">
          Total
        </div>
        {columnLabels.map((labels, index) => (
          <div
            key={index}
            className="flex items-start justify-between px-12  h-8"
          >
            {labels.map((label) => (
              <div key={label} className="text-4xl font-bold">
                {label}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-grow grid grid-cols-7 grid-rows-4 gap-4 ">
        <BranchLevel
          levelIndex={3}
          occupancyMap={occupancyMap[3]}
          currentTarget={currentTarget}
          onCurrentTargetClick={handleCurrentTargetClick}
          onOccupancyChange={handleOccupancyChange}
        />

        <BranchLevel
          levelIndex={2}
          occupancyMap={occupancyMap[2]}
          currentTarget={currentTarget}
          onCurrentTargetClick={handleCurrentTargetClick}
          onOccupancyChange={handleOccupancyChange}
        />

        <BranchLevel
          levelIndex={1}
          occupancyMap={occupancyMap[1]}
          currentTarget={currentTarget}
          onCurrentTargetClick={handleCurrentTargetClick}
          onOccupancyChange={handleOccupancyChange}
        />
        <TroughLevel
          levelIndex={0}
          occupancyMap={occupancyMap[0]}
          onOccupancyChange={handleOccupancyChange}
          currentTarget={currentTarget}
          onCurrentTargetClick={handleCurrentTargetClick}
        />
      </div>
      {connected ? (<span className={'text-green-500'}>Connected</span>) : (<span className={'text-red-500'}>NOT CONNECTED</span>)}
    </div>
  );
}

export default App;
