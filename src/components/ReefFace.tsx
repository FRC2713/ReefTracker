import { Branch } from './Branch';
import { Algae } from './Algae';

export interface ReefFaceProps {
  faceId?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// ReefFace component
export function ReefFace({
  faceId = 0,
  position = [0, 0, 0.01],
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
      <Algae position={[0, -1.560500841 / 2 - 0.3, 0]} faceId={faceId} />

      <Branch
        position={[-0.3286190024 / 2, -1.560500841 / 2, 0]}
        branchNumber={faceId + 1}
      />
    </group>
  );
}
