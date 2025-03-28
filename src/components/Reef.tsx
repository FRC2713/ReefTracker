import { Html } from '@react-three/drei';
import { useReefStore } from '../store/useReefStore';
import { ReefFace } from './ReefFace';
import { useCallback, useMemo } from 'react';
import { useThree } from '@react-three/fiber';

export interface ReefFaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// Memoized Reef component to prevent unnecessary re-renders
export function Reef({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...groupProps
}: ReefFaceProps) {
  const store = useReefStore();
  const { currentTarget, setLevel } = store();
  const { camera } = useThree();

  // Memoize the reef faces to prevent unnecessary re-renders
  const reefFaces = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const angle = (i * -Math.PI * 2) / 6;
      return <ReefFace key={i} faceId={i * 2} rotation={[0, 0, angle]} />;
    });
  }, []);

  // Calculate scale based on camera zoom
  const scale = useMemo(() => {
    // Assuming default camera position is at z=4 (from Canvas2D.tsx)
    const defaultZoom = 0.125;
    const currentZoom = camera.position.z;
    return defaultZoom / currentZoom;
  }, [camera.position.z]);

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

  // Memoize button class names
  const level4ClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        isActiveLevel(4)
          ? 'bg-yellow-500 text-white scale-110 shadow-lg shadow-yellow-500/50'
          : 'bg-gray-700 text-white hover:bg-yellow-400'
      }`,
    [isActiveLevel]
  );

  const level3ClassName = useMemo(
    () =>
      `px-6 py-3 text-xl font-bold rounded-lg transition-all duration-150 ${
        isActiveLevel(3)
          ? 'bg-yellow-500 text-white scale-110 shadow-lg shadow-yellow-500/50'
          : 'bg-gray-700 text-white hover:bg-yellow-400'
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
          ? 'bg-yellow-500 text-white scale-110 shadow-lg shadow-yellow-500/50'
          : 'bg-gray-700 text-white hover:bg-yellow-400'
      }`,
    [isActiveLevel]
  );

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <group raycast={() => null}>
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[1.92 / 2, 6]} />
          <meshLambertMaterial color="#CCCCCC" />
        </mesh>
        <group position={[0, 0, 0]}>
          <Html transform scale={scale}>
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
      </group>

      {reefFaces}
    </group>
  );
}
