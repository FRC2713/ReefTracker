import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { ReactNode, memo } from 'react';

export interface Canvas2DProps {
  children: ReactNode;
}

function Canvas2DComponent({ children }: Canvas2DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        linear
        className="w-full h-full"
        style={{ background: '#333333' }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 4]} zoom={500}>
          <pointLight intensity={1} position={[0, 0, 0]} />
        </OrthographicCamera>
        <OrbitControls
          enableRotate={false}
          enablePan={false}
          enableZoom={false}
        />
        <ambientLight intensity={0.8} />
        <hemisphereLight intensity={0.5} groundColor="#DDDDDD" />
        {children}
      </Canvas>
    </div>
  );
}

// Export a memoized version of the component
export const Canvas2D = memo(Canvas2DComponent);
