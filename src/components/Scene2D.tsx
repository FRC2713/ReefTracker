import { useEffect, useRef, useState } from 'react';
import { Mesh } from 'three';
import { Reef } from './Reef';
import { BranchAddress } from '../App';
import { GameHud } from './GameHud';

export interface Scene2DProps {
  gridSize?: number;
  gridDivisions?: number;
  onBranchClick: (branch: BranchAddress | null) => void;
  currentTarget: BranchAddress | null;
}

export function Scene2D({
  gridSize = 10,
  gridDivisions = 10,
  onBranchClick,
  currentTarget,
}: Scene2DProps) {
  const gridRef = useRef<Mesh>(null);
  const [level, setLevel] = useState<number>(4);

  const handleBranchClick = (branch: number | null) => {
    console.log('branch', branch);
    if (branch === null) {
      onBranchClick(null);
    } else {
      onBranchClick({ level: level, index: branch });
    }
  };

  useEffect(() => {
    if (currentTarget) {
      onBranchClick({
        level,
        index: currentTarget.index,
      });
    }
  }, [currentTarget, level, onBranchClick]);

  return (
    <group>
      <GameHud
        level={level}
        setLevel={setLevel}
        currentTarget={currentTarget}
        setCurrentTarget={onBranchClick}
      />
      <group>
        <gridHelper
          ref={gridRef}
          args={[gridSize, gridDivisions, '#FFFFFF', '#AAAAAA']}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -0.1]}
        />

        <Reef onBranchClick={handleBranchClick} currentTarget={currentTarget} />
      </group>
    </group>
  );
}
