import Scene from './ecs/Scene';
import Entity from './ecs/Entity';
import * as components from './components';
import * as THREE from 'three';

const getInitScene = () => {
  const scene = new Scene();

  const playerCameraEnt = new Entity();
  playerCameraEnt.addComponent(
    new components.Name('Player Camera')
  );
  playerCameraEnt.addComponent(
    new components.IsMainPlayerCamera()
  );
  playerCameraEnt.addComponent(
    new components.CameraEnum(
      components.CameraEnum.Which.Perspective,
      { fov: 75, aspectRatio: 1, near: 0.1, far: 1000.0 }
    )
  );
  scene.addEntity(playerCameraEnt);

  const debugCameraEnt = new Entity();
  debugCameraEnt.addComponent(
    new components.Name('Debug Camera')
  );
  debugCameraEnt.addComponent(
    new components.IsMainDebugCamera()
  );
  debugCameraEnt.addComponent(
    new components.CameraEnum(
      components.CameraEnum.Which.Perspective,
      { fov: 75, aspectRatio: 1, near: 0.1, far: 1000.0 }
    )
  );
  scene.addEntity(debugCameraEnt);

  const cubeEnt = new Entity();
  const threeGeo = new THREE.BoxGeometry(3, 3, 3);
  cubeEnt.addComponent(
    new components.Name('Orange Cube')
  );
  cubeEnt.addComponent(
    new components.Geometry(
      threeGeo.vertices,
      threeGeo.faces
    )
  );
  cubeEnt.addComponent(
    new components.MaterialEnum(
      components.MaterialEnum.Which.StandardColor,
      { color: 0xffa500 }
    )
  );
  scene.addEntity(cubeEnt);

  return scene;
};

export default getInitScene;
