import { MapPin, MinusCircle, PlusCircle } from 'lucide-react';
import { BranchAddress } from '../App';
import { cn } from '../util/cn';

export type TroupProps = {
  level: number;
  index: number;
  occupancy: number;
  onOccupancyChange: (level: number, index: number, count: number) => void;
  currentTarget: BranchAddress | null;
  onCurrentTargetClick: (target: BranchAddress) => void;
};

export function Trough(props: TroupProps) {
  const isTarget =
    props.currentTarget?.level === props.level &&
    props.currentTarget.index === props.index;
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-zinc-900 rounded">
      <div className="w-full flex justify-center items-center gap-4">
        <MinusCircle
          className="h-10 w-10 text-white/20"
          onClick={() =>
            props.onOccupancyChange(
              props.level,
              props.index,
              props.occupancy - 1
            )
          }
        />
        <div className="rounded m-y-2 text-center text-7xl flex items-center justify-center select-none">
          {props.occupancy}
        </div>
        <PlusCircle
          className="h-10 w-10 text-white/20"
          onClick={() =>
            props.onOccupancyChange(
              props.level,
              props.index,
              props.occupancy + 1
            )
          }
        />
      </div>
      <MapPin
        className={cn(
          'h-10 w-10',
          isTarget ? 'text-white animate-ping' : 'text-white/20 animate-none'
        )}
        onClick={() =>
          props.onCurrentTargetClick({ level: props.level, index: props.index })
        }
      />
    </div>
  );
}
