import { ReefFace } from './ReefFace';
import { BranchAddress } from '../App';

export interface ReefFaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onBranchClick: (branch: number | null) => void;
  currentTarget: BranchAddress | null;
}

export function Reef({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onBranchClick,
  currentTarget,
  ...groupProps
}: ReefFaceProps) {
  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <group>
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[1.6636165864 / 2, 6]} />
          <meshLambertMaterial color="#CCCCCC" />
        </mesh>
      </group>

      {[...Array(6)].map((_, i) => {
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
      })}
    </group>
  );
}
