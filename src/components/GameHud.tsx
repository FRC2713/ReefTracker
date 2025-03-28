import { Hud, OrthographicCamera, Html } from '@react-three/drei';
import { memo, useCallback } from 'react';
import { useReefStore } from '../store/useReefStore';

function GameHudComponent() {
  const store = useReefStore();
  const { setCurrentTarget } = store();
  const handleClearClick = useCallback(
    () => setCurrentTarget(null),
    [setCurrentTarget]
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
