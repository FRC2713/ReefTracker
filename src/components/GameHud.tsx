import { Hud, OrthographicCamera, Html } from '@react-three/drei';
import { memo, useCallback, useMemo } from 'react';
import { useReefStore } from '../store/useReefStore';

function GameHudComponent() {
  const store = useReefStore();
  const { currentTarget, setLevel, setCurrentTarget } = store();

  // Function to determine if a level button is active
  const isActiveLevel = useCallback(
    (buttonLevel: number) => currentTarget?.level === buttonLevel,
    [currentTarget]
  );

  // Memoize level button handlers
  const handleLevel4Click = useCallback(() => setLevel(4), [setLevel]);
  const handleLevel3Click = useCallback(() => setLevel(3), [setLevel]);
  const handleLevel2Click = useCallback(() => setLevel(2), [setLevel]);
  const handleLevel1Click = useCallback(() => setLevel(1), [setLevel]);
  const handleClearClick = useCallback(
    () => setCurrentTarget(null),
    [setCurrentTarget]
  );

  // Memoize button class names
  const level4ClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        isActiveLevel(4)
          ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-600/50'
          : 'bg-gray-700 text-white hover:bg-red-500'
      }`,
    [isActiveLevel]
  );

  const level3ClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        isActiveLevel(3)
          ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/50'
          : 'bg-gray-700 text-white hover:bg-orange-400'
      }`,
    [isActiveLevel]
  );

  const level2ClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        isActiveLevel(2)
          ? 'bg-yellow-500 text-white scale-110 shadow-lg shadow-yellow-500/50'
          : 'bg-gray-700 text-white hover:bg-yellow-400'
      }`,
    [isActiveLevel]
  );

  const level1ClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        isActiveLevel(1)
          ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/50'
          : 'bg-gray-700 text-white hover:bg-green-400'
      }`,
    [isActiveLevel]
  );

  return (
    <Hud>
      <OrthographicCamera makeDefault position={[0, 0, 4]} />

      <group position={[0, 0, 0]}>
        <Html center>
          <div className="flex flex-col gap-3 bg-black/70 p-3 rounded-lg w-40">
            <button onClick={handleLevel4Click} className={level4ClassName}>
              L4
            </button>
            <button onClick={handleLevel3Click} className={level3ClassName}>
              L3
            </button>
            <button onClick={handleLevel2Click} className={level2ClassName}>
              L2
            </button>
            <button onClick={handleLevel1Click} className={level1ClassName}>
              L1
            </button>
          </div>
        </Html>
      </group>
      <group
        position={[
          -window.innerWidth / 2 + 50,
          -window.innerHeight / 2 + 150,
          0,
        ]}
      >
        <Html>
          <div className="flex flex-col gap-3 bg-black/70 p-3 rounded-lg">
            <button
              onClick={handleClearClick}
              className="px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 bg-gray-700 text-white hover:bg-red-500"
            >
              CLEAR
            </button>
          </div>
        </Html>
      </group>
    </Hud>
  );
}

// Export a memoized version of the component
export const GameHud = memo(GameHudComponent);
