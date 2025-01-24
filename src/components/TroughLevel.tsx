import { BranchAddress, columnLabels } from '../App';
import { Trough } from './Trough';
import { LevelCounter } from './LevelCounter';

type TroughLevelProps = {
  levelIndex: number;
  occupancyMap: number[];
  onOccupancyChange: (level: number, index: number, count: number) => void;
  currentTarget: BranchAddress | null;
  onCurrentTargetClick: (target: BranchAddress) => void;
};

export function TroughLevel(props: TroughLevelProps) {
  return (
    <>
      <LevelCounter occupancyMap={props.occupancyMap} />
      {columnLabels.map((_label, index) => (
        <Trough
          key={index}
          occupancy={props.occupancyMap[index]}
          index={index}
          level={0}
          onOccupancyChange={props.onOccupancyChange}
          currentTarget={props.currentTarget}
          onCurrentTargetClick={props.onCurrentTargetClick}
        />
      ))}
    </>
  );
}
