import { useMemo } from 'react';
import { cn } from '../util/cn';

type LevelCounterProps = {
  occupancyMap: number[];
};

export function LevelCounter({ occupancyMap }: LevelCounterProps) {
  const levelSum = useMemo(
    () => occupancyMap.reduce((a, b) => a + b, 0),
    [occupancyMap]
  );
  return (
    <div
      className={cn(
        'h-full w-full flex flex-col justify-center items-center rounded',
        levelSum >= 5 ? 'bg-green-700' : 'bg-green-700/0'
      )}
    >
      <span className="text-6xl font-bold">{levelSum}</span>
    </div>
  );
}
