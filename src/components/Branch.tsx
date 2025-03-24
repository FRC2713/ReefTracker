import { MapPin } from 'lucide-react';
import { ReefAddress } from '../App';
import { cn } from '../util/cn';

type BranchProps = {
  level: number;
  index: number;
  occupancy: number;
  onOccupancyChange: (level: number, index: number, count: number) => void;
  currentTarget: ReefAddress | null;
  onCurrentTargetClick: (target: ReefAddress) => void;
};

export function Branch({
  level,
  index,
  occupancy,
  onOccupancyChange,
  currentTarget,
  onCurrentTargetClick,
}: BranchProps) {
  const isCurrentTarget =
    currentTarget?.level === level && currentTarget.index === index;
  return (
    <div
      className={cn(
        'w-full h-full rounded flex flex-col items-center justify-center select-none bg-zinc-900'
      )}
    >
      <div
        className="w-full h-full flex justify-center items-center rounded"
        onClick={() => onOccupancyChange(level, index, occupancy ? 0 : 1)}
      >
        <div
          className={cn(
            'w-12 h-12 bg-violet-500 rounded-full outline outline-8 outline-offset-4',
            occupancy ? ' outline-white' : ' outline-transparent'
          )}
        />
      </div>
      <div
        className={cn(
          'w-full h-full flex justify-center items-center rounded',
          isCurrentTarget ? 'bg-red-600' : 'bg-red-600/0'
        )}
        onClick={() => {
          onCurrentTargetClick({ level, index });
        }}
      >
        <MapPin
          className={cn(
            'h-10 w-10',
            isCurrentTarget
              ? 'text-white animate-ping'
              : 'text-white/20 animate-none'
          )}
        />
      </div>
    </div>
  );
}
