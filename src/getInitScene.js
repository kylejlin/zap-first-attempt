import VirtualScene from './ecs/VirtualScene';
import VirtualEntity from './ecs/VirtualEntity';
import * as components from './components';
import * as THREE from 'three';

import getKeyDictGlobal from './getKeyDictGlobal';

const getInitScene = () => {
  const scene = new VirtualScene();
  scene.globals.keyDict = getKeyDictGlobal();

  const playerCameraEnt = new VirtualEntity();
  playerCameraEnt.addComponent(
    components.InspectorName('Player Camera')
  );
  playerCameraEnt.addComponent(
    components.IsMainPlayerCamera()
  );
  playerCameraEnt.addComponent(
    components.CameraEnum(
      components.CameraEnum.Which.Perspective,
      { fov: 75, aspectRatio: 1, near: 0.1, far: 1000.0 }
    )
  );
  playerCameraEnt.addComponent(
    components.Position(0, 0, 5)
  );
  playerCameraEnt.addComponent(
    components.Rotation(0, 0, 0, 'XYZ')
  );
  playerCameraEnt.addComponent(
    components.Scale(1, 1, 1)
  );
  scene.addEntity(playerCameraEnt);

  const debugCameraEnt = new VirtualEntity();
  debugCameraEnt.addComponent(
    components.InspectorName('Debug Camera')
  );
  debugCameraEnt.addComponent(
    components.IsMainDebugCamera()
  );
  debugCameraEnt.addComponent(
    components.CameraEnum(
      components.CameraEnum.Which.Perspective,
      { fov: 75, aspectRatio: 1, near: 0.1, far: 1000.0 }
    )
  );
  debugCameraEnt.addComponent(
    components.Position(0, 0, 5)
  );
  debugCameraEnt.addComponent(
    components.Rotation(0, 0, 0, 'XYZ')
  );
  debugCameraEnt.addComponent(
    components.Scale(1, 1, 1)
  );
  scene.addEntity(debugCameraEnt);

  const cubeEnt = new VirtualEntity();
  const threeGeo = new THREE.BoxGeometry(3, 3, 3);
  cubeEnt.addComponent(
    components.InspectorName('Orange Cube')
  );
  cubeEnt.addComponent(
    components.Geometry(
      threeGeo.vertices,
      threeGeo.faces
    )
  );
  cubeEnt.addComponent(
    components.MaterialEnum(
      components.MaterialEnum.Which.StandardColor,
      { color: 0xffa500 }
    )
  );
  scene.addEntity(cubeEnt);

  return scene;
};

export default getInitScene;
