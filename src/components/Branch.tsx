import { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useReefStore } from '../store/useReefStore';
import { ScoreAssistGoalType } from '../store/reefStore';
import { useAnimationFactor } from '../store/useReefStore';

export interface BranchProps {
  position: [number, number, number];
  branchNumber: number;
}

// Optimized static branch that doesn't animate
function StaticBranch({ position, branchNumber }: BranchProps) {
  const store = useReefStore();
  const { setCurrentTarget, currentTarget } = store();
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseFactor = useAnimationFactor();

  const isCurrentTarget = useMemo(
    () =>
      currentTarget?.type === ScoreAssistGoalType.CORAL &&
      currentTarget.index === branchNumber,
    [currentTarget, branchNumber]
  );

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(isCurrentTarget ? '#FFF000' : '#C4618C');
    }
  }, [isCurrentTarget]);

  // Apply the animation factor directly
  useEffect(() => {
    if (meshRef.current && isCurrentTarget) {
      meshRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
  }, [pulseFactor, isCurrentTarget]);

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
      <mesh
        onClick={handleClick}
        position={[0, 0, 0.01]}
        userData={{
          address: {
            index: branchNumber,
            type: ScoreAssistGoalType.CORAL,
          },
        }}
      >
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial transparent opacity={0.05} />
      </mesh>

      {/* Visible branch mesh */}
      <mesh raycast={() => null} ref={meshRef}>
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
function AnimatedBranch({ position, branchNumber }: BranchProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseFactor = useAnimationFactor();

  // Apply the animation factor directly
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
  }, [pulseFactor]);

  return (
    <group position={position}>
      {/* Larger invisible mesh for better touch target */}
      <mesh
        position={[0, 0, 0.01]}
        userData={{
          address: {
            index: branchNumber,
            type: ScoreAssistGoalType.CORAL,
          },
        }}
      >
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial transparent opacity={0.5} color={'#FFF000'} />
      </mesh>

      {/* Visible branch mesh */}
      <mesh ref={meshRef} raycast={() => null}>
        <circleGeometry args={[0.042164, 32]} />
        <meshStandardMaterial
          color="#FFFF00"
          emissive="#FFFF00"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// Branch component that conditionally renders either static or animated version
export function Branch({ position, branchNumber }: BranchProps) {
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
