import { BranchAddress, columnLabels } from '../App';
import { Branch } from './Branch';
import { LevelCounter } from './LevelCounter';

type LevelProps = {
  levelIndex: number;
  occupancyMap: number[];
  onOccupancyChange: (level: number, index: number, count: number) => void;
  currentTarget: BranchAddress | null;
  onCurrentTargetClick: (target: BranchAddress) => void;
};

export function BranchLevel({
  levelIndex: levelNumber,
  currentTarget,
  onOccupancyChange,
  onCurrentTargetClick,
  occupancyMap,
}: LevelProps) {
  return (
    <>
      <LevelCounter occupancyMap={occupancyMap} />
      {columnLabels.map((label, index) => (
        <div className="flex items-center justify-center">
          {label.map((_, i) => (
            <Branch
              key={index}
              level={levelNumber}
              index={2 * index + i}
              occupancy={occupancyMap[2 * index + i]}
              onOccupancyChange={onOccupancyChange}
              currentTarget={currentTarget}
              onCurrentTargetClick={onCurrentTargetClick}
            />
          ))}
        </div>
      ))}
    </>
  );
}
