import { Box3, Group, Mesh, Sphere, Vector3 } from 'three';

import { CameraControls } from '@react-three/drei';

/**
 * Get the bounding box of the scene, ignoring groups or invalid geometries
 * @param group The group to get the bounding box of
 * @returns The bounding box of the scene
 */
export function getBoundingBox(group: Group): Box3 {
  const boundingBox = new Box3();
  group.traverse((child) => {
    if (child instanceof Mesh) {
      boundingBox.expandByObject(child);
    }
  });
  return boundingBox;
}

/**
 * Fit the scene to the screen
 * @param lookFrom The position to look from
 * @param scene The scene to fit
 * @param camera The camera to fit
 * @returns The camera position and target
 */
export function fitToScreen(
  lookFrom: Vector3,
  scene: Group,
  camera: CameraControls
) {
  const sphere = new Sphere();
  getBoundingBox(scene).getBoundingSphere(sphere);
  const distance = camera.getDistanceToFitSphere(sphere.radius);
  const cameraPos = lookFrom
    .clone()
    .normalize()
    .multiplyScalar(distance)
    .add(sphere.center);

  return { position: cameraPos, target: sphere.center };
}
