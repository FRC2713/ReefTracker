import { ReefAddress } from '../App';
import { Trough } from './Trough';
import { LevelCounter } from './LevelCounter';
import { columnLabels } from '../constants';

type TroughLevelProps = {
  levelIndex: number;
  occupancyMap: number[];
  onOccupancyChange: (level: number, index: number, count: number) => void;
  currentTarget: ReefAddress | null;
  onCurrentTargetClick: (target: ReefAddress) => void;
};

export function TroughLevel(props: TroughLevelProps) {
  return (
    <>
      <LevelCounter occupancyMap={props.occupancyMap} />
      {columnLabels.map((_label, index) => (
        <Trough
          key={index}
          occupancy={props.occupancyMap[index]}
          index={index * 2}
          level={0}
          onOccupancyChange={props.onOccupancyChange}
          currentTarget={props.currentTarget}
          onCurrentTargetClick={props.onCurrentTargetClick}
        />
      ))}
    </>
  );
}
