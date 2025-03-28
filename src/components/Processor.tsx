import { useReefStore } from '../store/useReefStore';
import { ScoreAssistGoalType } from '../store/reefStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export interface ProcessorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Processor({
  position = [2, 1, 0],
  rotation = [0, 0, -Math.PI / 2],
  ...groupProps
}: ProcessorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const store = useReefStore();
  const { currentTarget, setCurrentTarget } = store();

  const isCurrentTarget = currentTarget?.type === ScoreAssistGoalType.PROCESSOR;

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;

    if (isCurrentTarget) {
      material.color.setHex(0x059669); // green-600
      material.emissive.setHex(0x059669);
      material.emissiveIntensity = Math.sin(state.clock.elapsedTime * 3);
    } else {
      material.color.setHex(0x0d9488); // teal-600
      material.emissive.setHex(0x0d9488);
      material.emissiveIntensity = 0;
    }
  });

  return (
    <group position={position} rotation={rotation} {...groupProps}>
      <mesh
        ref={meshRef}
        onClick={() =>
          setCurrentTarget(
            isCurrentTarget
              ? null
              : {
                  type: ScoreAssistGoalType.PROCESSOR,
                  level: 0,
                  index: 0,
                }
          )
        }
      >
        <planeGeometry args={[0.7112, 0.2]} />
        <meshStandardMaterial
          color={isCurrentTarget ? 0x059669 : 0x0d9488}
          metalness={0.5}
          roughness={0.5}
          emissive={isCurrentTarget ? 0x059669 : 0x0d9488}
          emissiveIntensity={0}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        PROC
      </Text>
    </group>
  );
}
