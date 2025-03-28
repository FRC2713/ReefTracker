import { ScoreAssistGoalType } from '../store/reefStore';
import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReefStore } from '../store/useReefStore';

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

export interface ReefFaceProps {
  faceId?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

interface BranchProps {
  position: [number, number, number];
  branchNumber: number;
}

// Create a shared animation factor to avoid redundant calculations
const useAnimationFactor = () => {
  const [factor, setFactor] = useState(1);

  // Only run one animation frame handler for all branches
  useFrame(() => {
    const pulseFactor = Math.sin(Date.now() * 0.01) * 0.2 + 1.2;
    setFactor(pulseFactor);
  });

  return factor;
};

// Algae component - seafoam green circle that's larger than branches
function Algae({
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
      <mesh onClick={handleClick} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial transparent opacity={0.05} />
      </mesh>

      <mesh ref={meshRef}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial
          color="#66CDAA"
          emissive="#66CDAA"
          emissiveIntensity={isCurrentTarget ? 0.5 : 0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

// Optimized static branch that doesn't animate
function StaticBranch({
  position,
  branchNumber,
}: Omit<BranchProps, 'isCurrentTarget' | 'level'>) {
  const store = useReefStore();
  const { setCurrentTarget, currentTarget } = store();

  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    setCurrentTarget({
      type: ScoreAssistGoalType.CORAL,
      index: branchNumber,
      level: currentTarget?.level || 4,
    });
  }, [branchNumber, setCurrentTarget, currentTarget]);

  return (
    <group position={position}>
      {/* Larger invisible mesh for better touch target */}
      <mesh onClick={handleClick} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial transparent opacity={0.05} />
      </mesh>

      {/* Visible branch mesh */}
      <mesh>
        <circleGeometry args={[0.042164, 32]} />
        <meshStandardMaterial
          color="#C4618C"
          emissive="#000000"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

// Animated branch that uses the shared animation factor
function AnimatedBranch({
  position,
}: Omit<BranchProps, 'isCurrentTarget' | 'onClick'>) {
  const store = useReefStore();
  const { currentTarget, setCurrentTarget } = store();
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseFactor = useAnimationFactor();

  // Apply the animation factor directly
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
  }, [pulseFactor]);

  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    setCurrentTarget(null);
  }, [setCurrentTarget]);

  const color = useMemo(() => {
    if (!currentTarget?.level) return '#FFFF00';
    switch (currentTarget.level) {
      case 4:
        return '#DC2626';
      case 3:
        return '#F97316';
      case 2:
        return '#EAB308';
      case 1:
        return '#22C55E';
    }
  }, [currentTarget]);

  return (
    <group position={position}>
      {/* Larger invisible mesh for better touch target */}
      <mesh onClick={handleClick} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial transparent opacity={0.05} />
      </mesh>

      {/* Visible branch mesh */}
      <mesh ref={meshRef}>
        <circleGeometry args={[0.042164, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// Branch component that conditionally renders either static or animated version
function Branch({ position, branchNumber }: BranchProps) {
  const store = useReefStore();
  const { currentTarget } = store();
  const isCurrentTarget = useMemo(
    () =>
      currentTarget?.type === ScoreAssistGoalType.CORAL &&
      currentTarget.index === branchNumber,
    [currentTarget, branchNumber]
  );

  // Conditionally render either the animated or static branch
  return isCurrentTarget ? (
    <AnimatedBranch position={position} branchNumber={branchNumber} />
  ) : (
    <StaticBranch position={position} branchNumber={branchNumber} />
  );
}

// ReefFace component
export function ReefFace({
  faceId = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...groupProps
}: ReefFaceProps) {
  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <Branch
        position={[0.3286190024 / 2, -1.560500841 / 2, 0]}
        branchNumber={faceId}
      />

      {/* Algae component positioned between the two branches */}
      <Algae position={[0, -1.560500841 / 2 - 0.2, 0]} faceId={faceId} />

      <Branch
        position={[-0.3286190024 / 2, -1.560500841 / 2, 0]}
        branchNumber={faceId + 1}
      />
    </group>
  );
}
