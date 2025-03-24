import { Html } from '@react-three/drei';
import { useReefStore } from '../store/useReefStore';
import { ScoreAssistGoalType } from '../store/reefStore';

export interface ProcessorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Processor({
  position = [2, 1, 0],
  rotation = [0, 0, 0],
  ...groupProps
}: ProcessorProps) {
  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <Html>
        <div className="flex flex-col items-center w-[200px] text-4xl">
          <ProcessorButton />
        </div>
      </Html>
    </group>
  );
}

function ProcessorButton() {
  const store = useReefStore();
  const { currentTarget, setCurrentTarget } = store();

  const isCurrentTarget = currentTarget?.type === ScoreAssistGoalType.PROCESSOR;

  return (
    <button
      className={`rounded-lg font-bold shadow-lg transition-all duration-150 text-white px-4 py-2 w-full h-20 text-4xl border-4 rotate-90 ${
        isCurrentTarget
          ? 'bg-green-600 border-green-400 animate-pulse shadow-green-500/50'
          : 'bg-teal-600 border-teal-500 hover:bg-teal-500 active:scale-95'
      }`}
      onClick={() =>
        setCurrentTarget(
          isCurrentTarget
            ? null
            : {
                type: ScoreAssistGoalType.PROCESSOR,
                level: 0,
                index: 0,
              }
        )
      }
    >
      PROC
    </button>
  );
}
