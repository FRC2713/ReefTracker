import { BranchAddress } from '../App';
import { useRef, useEffect, useCallback, memo, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ReefFaceProps {
  faceId?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onBranchClick: (branch: number | null) => void;
  currentTarget: BranchAddress | null;
}

interface BranchProps {
  position: [number, number, number];
  isCurrentTarget: boolean;
  branchNumber: number;
  onClick: (branchNumber: number | null) => void;
  level: number | undefined;
}

// Create a shared animation clock to avoid redundant calculations
const useAnimationFactor = () => {
  const [factor, setFactor] = useState(1);

  // Only run one animation frame handler for all branches
  useFrame(() => {
    const pulseFactor = Math.sin(Date.now() * 0.01) * 0.2 + 1.2;
    setFactor(pulseFactor);
  });

  return factor;
};

// Optimized static branch that doesn't animate
const StaticBranch = memo(function StaticBranchComponent({
  position,
  onClick,
  branchNumber,
}: Omit<BranchProps, 'isCurrentTarget' | 'level'>) {
  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    onClick(branchNumber);
  }, [branchNumber, onClick]);

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
});

// Animated branch that uses the shared animation factor
const AnimatedBranch = memo(function AnimatedBranchComponent({
  position,
  onClick,
  level,
}: Omit<BranchProps, 'isCurrentTarget' | 'branchNumber'>) {
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
    onClick(null);
  }, [onClick]);

  const color = useMemo(() => {
    if (!level) return '#FFFF00';
    switch (level) {
      case 4:
        return '#DC2626';
      case 3:
        return '#F97316';
      case 2:
        return '#EAB308';
      case 1:
        return '#22C55E';
    }
  }, [level]);

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
});

// Memoized Branch component that conditionally renders either static or animated version
const Branch = memo(function BranchComponent({
  position,
  isCurrentTarget,
  branchNumber,
  onClick,
  level,
}: BranchProps) {
  // Conditionally render either the animated or static branch
  return isCurrentTarget ? (
    <AnimatedBranch position={position} onClick={onClick} level={level} />
  ) : (
    <StaticBranch
      position={position}
      onClick={onClick}
      branchNumber={branchNumber}
    />
  );
});

// Memoized ReefFace component to prevent unnecessary re-renders
export const ReefFace = memo(function ReefFaceComponent({
  faceId = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onBranchClick,
  currentTarget,
  ...groupProps
}: ReefFaceProps) {
  // Memoize branch click handler to prevent unnecessary re-renders
  const handleBranchClick = useCallback(
    (branch: number | null) => {
      onBranchClick(branch);
    },
    [onBranchClick]
  );

  // Memoize the isCurrentTarget calculations
  const branch1IsTarget = currentTarget?.index === faceId;
  const branch2IsTarget = currentTarget?.index === faceId + 1;

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <Branch
        position={[0.3286190024 / 2, -1.560500841 / 2, 0]}
        isCurrentTarget={branch1IsTarget}
        onClick={handleBranchClick}
        branchNumber={faceId}
        level={currentTarget?.level}
      />
      <Branch
        position={[-0.3286190024 / 2, -1.560500841 / 2, 0]}
        isCurrentTarget={branch2IsTarget}
        onClick={handleBranchClick}
        branchNumber={faceId + 1}
        level={currentTarget?.level}
      />
    </group>
  );
});
