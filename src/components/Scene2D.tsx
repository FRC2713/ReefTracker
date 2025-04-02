import { forwardRef, useCallback, useRef } from 'react';
import { Group, Mesh, MeshBasicMaterial, CircleGeometry } from 'three';
import { Barge } from './Barge';
import { Processor } from './Processor';
import { Reef } from './Reef';
import { ThreeEvent } from '@react-three/fiber';
import { ScoreAssistAddress, ScoreAssistGoalType } from '../store/reefStore';
import { useReefStore } from '../store/useReefStore';

// Reusable geometries
const baseCircleGeometry = new CircleGeometry(0.5, 32);
const segmentGeometries = {
  segment4: new CircleGeometry(0.5, 32, Math.PI * 0.25, Math.PI / 2),
  segment3: new CircleGeometry(0.5, 32, Math.PI * 0.75, Math.PI / 2),
  segment1: new CircleGeometry(0.5, 32, Math.PI * 1.25, Math.PI / 2),
  segment2: new CircleGeometry(0.5, 32, Math.PI * 1.75, Math.PI / 2),
};

export const Scene2D = forwardRef<Group>((props, ref) => {
  const store = useReefStore();
  const { setCurrentTarget } = store();
  const selectionHelperRef = useRef<Group>(null);
  const segment4Ref = useRef<Mesh>(null);
  const segment3Ref = useRef<Mesh>(null);
  const segment1Ref = useRef<Mesh>(null);
  const segment2Ref = useRef<Mesh>(null);

  const targetRef = useRef<ScoreAssistAddress | null>(null);

  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!selectionHelperRef.current) {
      return;
    }

    event.stopPropagation();
    const target = event.intersections.find(
      (i) => i.object.userData.address !== undefined
    );
    targetRef.current = target?.object.userData.address;

    if (!target) {
      return;
    }

    if (target.object.userData.address.type === ScoreAssistGoalType.CORAL) {
      selectionHelperRef.current?.position.set(
        target.point.x,
        target.point.y,
        0
      );
      selectionHelperRef.current.visible = true;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (selectionHelperRef.current) {
      selectionHelperRef.current.visible = false;
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (selectionHelperRef.current) {
      if (targetRef.current) {
        setCurrentTarget(targetRef.current);
      }
      selectionHelperRef.current.visible = false;
    }
  }, [setCurrentTarget]);

  const handlePointerEnterSegment = useCallback((segment: number) => {
    const segmentRef =
      segment === 4
        ? segment4Ref
        : segment === 3
        ? segment3Ref
        : segment === 1
        ? segment1Ref
        : segment2Ref;
    if (segmentRef.current) {
      (segmentRef.current.material as MeshBasicMaterial).opacity = 0.7;
    }
    if (targetRef.current) {
      targetRef.current.level = segment;
    }
  }, []);

  const handlePointerLeaveSegment = useCallback((segment: number) => {
    const segmentRef =
      segment === 4
        ? segment4Ref
        : segment === 3
        ? segment3Ref
        : segment === 1
        ? segment1Ref
        : segment2Ref;
    if (segmentRef.current) {
      (segmentRef.current.material as MeshBasicMaterial).opacity = 0.1;
    }
  }, []);

  return (
    <group
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <gridHelper
        args={[10, 10, '#FFFFFF', '#AAAAAA']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -0.1]}
        raycast={() => null}
      />
      <group>
        <Barge />
        <Reef />
        <Processor />
        <group
          visible={false}
          ref={selectionHelperRef}
          onPointerLeave={handlePointerLeave}
          position={[0, 0, 0.05]}
        >
          <mesh>
            <primitive object={baseCircleGeometry} />
            <meshBasicMaterial transparent opacity={0.1} />
          </mesh>
          <mesh
            ref={segment4Ref}
            onPointerEnter={() => handlePointerEnterSegment(4)}
            onPointerLeave={() => handlePointerLeaveSegment(4)}
          >
            <primitive object={segmentGeometries.segment4} />
            <meshBasicMaterial transparent opacity={0.1} color={'yellow'} />
          </mesh>
          <mesh
            ref={segment3Ref}
            onPointerEnter={() => handlePointerEnterSegment(2)}
            onPointerLeave={() => handlePointerLeaveSegment(2)}
          >
            <primitive object={segmentGeometries.segment3} />
            <meshBasicMaterial transparent opacity={0.1} color={'yellow'} />
          </mesh>
          <mesh
            ref={segment1Ref}
            onPointerEnter={() => handlePointerEnterSegment(1)}
            onPointerLeave={() => handlePointerLeaveSegment(1)}
          >
            <primitive object={segmentGeometries.segment1} />
            <meshBasicMaterial transparent opacity={0.1} color={'yellow'} />
          </mesh>
          <mesh
            ref={segment2Ref}
            onPointerEnter={() => handlePointerEnterSegment(3)}
            onPointerLeave={() => handlePointerLeaveSegment(3)}
          >
            <primitive object={segmentGeometries.segment2} />
            <meshBasicMaterial transparent opacity={0.1} color={'yellow'} />
          </mesh>
        </group>
      </group>
    </group>
  );
});
