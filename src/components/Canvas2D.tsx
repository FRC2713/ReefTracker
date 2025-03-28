import { CameraControls, OrthographicCamera } from '@react-three/drei';
import CameraControlsImpl from 'camera-controls';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, Vector3 } from 'three';
import { fitToScreen } from '../util/cameraControls';
import { Scene2D } from './Scene2D';
import { GameHud } from './GameHud';

export function Canvas2D() {
  const sceneRef = useRef<Group>(null);
  const controlsRef = useRef<CameraControlsImpl>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    if (sceneRef.current && controlsRef.current) {
      setIsSceneReady(true);
    }
  }, [sceneRef, controlsRef]);

  useEffect(() => {
    if (!isSceneReady || !sceneRef.current || !controlsRef.current) return;

    const { position, target } = fitToScreen(
      new Vector3(0, 0, 1),
      sceneRef.current,
      controlsRef.current
    );

    controlsRef.current.setLookAt(
      position.x,
      position.y,
      position.z,
      target.x,
      target.y,
      target.z,
      true
    );
  }, [isSceneReady]);

  return (
    <div className="w-full h-full">
      <Canvas linear className="w-full h-full">
        <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={300}>
          <pointLight intensity={1} position={[0, 0, 0]} />
        </OrthographicCamera>
        <ambientLight intensity={0.8} />
        <hemisphereLight intensity={0.5} groundColor="#DDDDDD" />
        <CameraControls
          ref={controlsRef}
          mouseButtons={{
            left: CameraControlsImpl.ACTION.NONE,
            middle: CameraControlsImpl.ACTION.NONE,
            right: CameraControlsImpl.ACTION.NONE,
            wheel: CameraControlsImpl.ACTION.NONE,
          }}
          touches={{
            one: CameraControlsImpl.ACTION.NONE,
            two: CameraControlsImpl.ACTION.NONE,
            three: CameraControlsImpl.ACTION.NONE,
          }}
        />

        <GameHud />
        <Scene2D ref={sceneRef} />
      </Canvas>
    </div>
  );
}
