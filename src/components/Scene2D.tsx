import { useRef } from 'react';
import { Mesh } from 'three';
import { Reef } from './Reef';
import { GameHud } from './GameHud';

export interface Scene2DProps {
  gridSize?: number;
  gridDivisions?: number;
}

function Scene2DComponent({ gridSize = 10, gridDivisions = 10 }: Scene2DProps) {
  const gridRef = useRef<Mesh>(null);

  return (
    <group>
      <GameHud />
      <group>
        <gridHelper
          ref={gridRef}
          args={[gridSize, gridDivisions, '#FFFFFF', '#AAAAAA']}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -0.1]}
        />

        <Reef />
      </group>
    </group>
  );
}

// Export a memoized version of the component to prevent unnecessary re-renders
export const Scene2D = Scene2DComponent;
