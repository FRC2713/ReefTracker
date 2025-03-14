import { ReefFace } from './ReefFace';
import { BranchAddress } from '../App';
import { memo, useMemo } from 'react';

export interface ReefFaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onBranchClick: (branch: number | null) => void;
  currentTarget: BranchAddress | null;
}

// Memoized Reef component to prevent unnecessary re-renders
const ReefComponent = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onBranchClick,
  currentTarget,
  ...groupProps
}: ReefFaceProps) => {
  // Memoize the reef faces to prevent unnecessary re-renders
  const reefFaces = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const angle = (i * -Math.PI * 2) / 6;
      return (
        <ReefFace
          key={i}
          faceId={i * 2}
          rotation={[0, 0, angle]}
          onBranchClick={onBranchClick}
          currentTarget={currentTarget}
        />
      );
    });
  }, [onBranchClick, currentTarget]);

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <group>
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[1.6636165864 / 2, 6]} />
          <meshLambertMaterial color="#CCCCCC" />
        </mesh>
      </group>

      {reefFaces}
    </group>
  );
};

export const Reef = memo(ReefComponent);
