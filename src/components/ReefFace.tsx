import { BranchAddress } from '../App';
import { useRef, useEffect } from 'react';
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
}

export function Branch({
  position,
  isCurrentTarget,
  branchNumber,
  onClick,
}: BranchProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use animation frame to create a pulsing effect for the current target
  useFrame(() => {
    if (isCurrentTarget && meshRef.current) {
      // Create a pulsing scale effect
      const pulseFactor = Math.sin(Date.now() * 0.01) * 0.2 + 1.2;
      meshRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
  });

  // Reset scale when not targeted
  useEffect(() => {
    if (!isCurrentTarget && meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  }, [isCurrentTarget]);

  const handleClick = () => {
    console.log('branch clicked', branchNumber, isCurrentTarget);
    onClick(isCurrentTarget ? null : branchNumber);
  };

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <circleGeometry args={[0.042164, 32]} />
      <meshStandardMaterial
        color={isCurrentTarget ? '#FFFF00' : '#C4618C'}
        emissive={isCurrentTarget ? '#FFFF00' : '#000000'}
        emissiveIntensity={isCurrentTarget ? 0.8 : 0}
      />
    </mesh>
  );
}

export function ReefFace({
  faceId = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onBranchClick,
  currentTarget,
  ...groupProps
}: ReefFaceProps) {
  const handleBranchClick = (branch: number | null) => {
    console.log('branch clicked', branch, currentTarget);
    onBranchClick(branch);
  };

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <Branch
        position={[0.3286190024 / 2, -1.052501 / 2, 0]}
        isCurrentTarget={currentTarget?.index === faceId}
        onClick={handleBranchClick}
        branchNumber={faceId}
      />
      <Branch
        position={[-0.3286190024 / 2, -1.052501 / 2, 0]}
        isCurrentTarget={currentTarget?.index === faceId + 1}
        onClick={handleBranchClick}
        branchNumber={faceId + 1}
      />
    </group>
  );
}
