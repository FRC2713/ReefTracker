import { ReefFace } from './ReefFace';
import { useMemo } from 'react';

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
  // Memoize the reef faces to prevent unnecessary re-renders
  const reefFaces = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const angle = (i * -Math.PI * 2) / 6;
      return <ReefFace key={i} faceId={i * 2} rotation={[0, 0, angle]} />;
    });
  }, []);

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <group>
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[1.92 / 2, 6]} />
          <meshLambertMaterial color="#CCCCCC" />
        </mesh>
      </group>

      {reefFaces}
    </group>
  );
}
