import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ScoreAssistGoalType } from '../store/reefStore';
import { useAnimationFactor, useReefStore } from '../store/useReefStore';

const algaeLevelMap: Record<number, number> = {
  0: 3,
  1: 3,
  2: 2,
  3: 2,
  4: 3,
  5: 3,
  6: 2,
  7: 2,
  8: 3,
  9: 3,
  10: 2,
  11: 2,
};
// Algae component - seafoam green circle that's larger than branches
export function Algae({
  position,
  faceId,
}: {
  position: [number, number, number];
  faceId: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const waveFactor = useAnimationFactor();
  const store = useReefStore();
  const { setCurrentTarget, currentTarget } = store();

  const isCurrentTarget = useMemo(() => {
    return (
      currentTarget?.type === ScoreAssistGoalType.ALGAE &&
      currentTarget.index === faceId / 2
    );
  }, [currentTarget, faceId]);

  // Apply a gentler animation to algae only when it's the current target
  useEffect(() => {
    if (meshRef.current && isCurrentTarget) {
      const gentleWave = 1 + (waveFactor - 1) * 0.5;
      meshRef.current.scale.set(gentleWave, gentleWave, gentleWave);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  }, [waveFactor, isCurrentTarget]);

  const handleClick = useCallback(() => {
    setCurrentTarget(
      isCurrentTarget
        ? null
        : {
            type: ScoreAssistGoalType.ALGAE,
            index: faceId / 2,
            level: algaeLevelMap[faceId],
          }
    );
  }, [faceId, isCurrentTarget, setCurrentTarget]);

  return (
    <group position={position}>
      {/* Larger invisible mesh for better touch target */}
      <mesh
        onClick={handleClick}
        userData={{
          address: {
            type: ScoreAssistGoalType.ALGAE,
            index: faceId / 2,
            level: algaeLevelMap[faceId],
          },
        }}
      >
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial
          transparent
          opacity={isCurrentTarget ? 0.5 : 0.05}
          color={isCurrentTarget ? '#FFF000' : '#66CDAA'}
        />
      </mesh>

      <mesh ref={meshRef} raycast={() => null}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial
          color={isCurrentTarget ? '#FFF000' : '#66CDAA'}
          emissive={isCurrentTarget ? '#FFF000' : '#66CDAA'}
          emissiveIntensity={isCurrentTarget ? 0.5 : 0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}
