import { Html } from '@react-three/drei';
import { useReefStore } from '../store/useReefStore';
import { ScoreAssistGoalType } from '../store/reefStore';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';

export interface BargeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Barge({
  position = [-2.25, 1.25, 0],
  rotation = [0, 0, 0],
  ...groupProps
}: BargeProps) {
  const { camera } = useThree();

  // Calculate scale based on camera zoom
  const scale = useMemo(() => {
    // Assuming default camera position is at z=4 (from Canvas2D.tsx)
    const defaultZoom = 0.125;
    const currentZoom = camera.position.z;
    return defaultZoom / currentZoom;
  }, [camera.position.z]);

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <Html transform scale={scale}>
        <div className="flex flex-col items-center gap-8 w-[450px] text-4xl">
          <BargeButton />
          <div className="flex flex-row justify-between gap-4 w-full px-6">
            <CageButton index={0} />
            <CageButton index={1} />
            <CageButton index={2} />
          </div>
        </div>
      </Html>
    </group>
  );
}

function BargeButton() {
  const store = useReefStore();
  const { currentTarget, setCurrentTarget } = store();

  const isCurrentTarget = currentTarget?.type === ScoreAssistGoalType.BARGE;

  return (
    <button
      className={`rounded-lg font-bold shadow-lg transition-all duration-150 text-white px-4 py-2 w-full h-20 text-4xl border-4 ${
        isCurrentTarget
          ? 'bg-green-600 border-green-400 animate-pulse shadow-green-500/50'
          : 'bg-blue-600 border-blue-500 hover:bg-blue-500 active:scale-95'
      }`}
      onClick={() =>
        setCurrentTarget(
          isCurrentTarget
            ? null
            : {
                type: ScoreAssistGoalType.BARGE,
                level: 0,
                index: 0,
              }
        )
      }
    >
      BARGE
    </button>
  );
}

function CageButton({ index }: { index: number }) {
  const store = useReefStore();
  const { currentTarget, setCurrentTarget } = store();

  const isCurrentTarget =
    currentTarget?.type === ScoreAssistGoalType.CAGE &&
    currentTarget.index === index;

  const label = index === 0 ? 'L' : index === 1 ? 'M' : 'R';

  // Colors based on position for visual distinction
  const baseColors = [
    'bg-amber-600 border-amber-500 hover:bg-amber-500',
    'bg-purple-600 border-purple-500 hover:bg-purple-500',
    'bg-red-600 border-red-500 hover:bg-red-500',
  ];

  const activeColors = [
    'bg-green-600 border-green-400 shadow-green-500/50',
    'bg-green-600 border-green-400 shadow-green-500/50',
    'bg-green-600 border-green-400 shadow-green-500/50',
  ];

  return (
    <button
      onClick={() =>
        setCurrentTarget(
          isCurrentTarget
            ? null
            : {
                type: ScoreAssistGoalType.CAGE,
                level: 0,
                index: index,
              }
        )
      }
      className={`rounded-lg font-bold shadow-lg transition-all duration-150 text-white px-2 py-1 h-44 w-16 text-5xl border-4 ${
        isCurrentTarget
          ? `${activeColors[index]} animate-pulse`
          : `${baseColors[index]} active:scale-95`
      }`}
    >
      {label}
    </button>
  );
}
