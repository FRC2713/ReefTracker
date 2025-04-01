import { Html, Hud, OrthographicCamera } from '@react-three/drei';
import { useCallback, useMemo } from 'react';
import { useReefStore } from '../store/useReefStore';

export function GameHud() {
  const store = useReefStore();
  const { setCurrentTarget, setClimbPrep, climbPrep } = store();
  const handleClearClick = useCallback(
    () => setCurrentTarget(null),
    [setCurrentTarget]
  );
  const handleClimbPrepClick = useCallback(
    () => setClimbPrep(!climbPrep),
    [setClimbPrep, climbPrep]
  );

  const climbPrepClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        climbPrep
          ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/50'
          : 'bg-gray-700 text-white'
      }`,
    [climbPrep]
  );
  return (
    <Hud>
      <OrthographicCamera makeDefault position={[0, 0, 4]} />

      <group
        position={[
          -window.innerWidth / 2 + 50,
          -window.innerHeight / 2 + 150,
          0,
        ]}
      >
        <Html>
          <div className="flex flex-row gap-16 bg-black/70 p-3 rounded-lg">
            <button
              onClick={handleClearClick}
              className="px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 bg-gray-700 text-white hover:bg-red-500"
            >
              CLEAR
            </button>
            <button
              onClick={handleClimbPrepClick}
              className={climbPrepClassName}
            >
              CLIMB PREP
            </button>
          </div>
        </Html>
      </group>
    </Hud>
  );
}
