import System from './ecs/System';
import IndexSpec from './ecs/IndexSpec';
import * as THREE from 'three';
import * as components from './components';

const getRenderSystem = (reactComponent) => {
  const {
    previewThreeScene,
    previewThreeRenderer,
    playThreeScene,
    playThreeRenderer,
  } = reactComponent.state;

  const render = new System(
    'Render',
    ({ dt }, scene, [playerCameraIndex, debugCameraIndex, thingIndex]) => {
      {
        previewThreeScene.children = [];
        const [debugCamera] = debugCameraIndex.entities;
        const { fov, aspectRatio, near, far } = debugCamera.getComponent(components.CameraEnum).value;
        const threeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        threeCamera.position.set(0, 0, 5);

        for (const thingEnt of thingIndex.entities) {
          const geoComp = thingEnt.getComponent(components.Geometry);
          const matComp = thingEnt.getComponent(components.MaterialEnum);
          const threeGeo = new THREE.Geometry();
          threeGeo.vertices = geoComp.vertices;
          threeGeo.faces = geoComp.faces;
          // TODO get actual material (+ standard)
          const threeMat = new THREE.MeshBasicMaterial({ color: matComp.value.color });
          const threeMesh = new THREE.Mesh(threeGeo, threeMat);
          previewThreeScene.add(threeMesh);
        }

        previewThreeRenderer.render(previewThreeScene, threeCamera);
      }

      {
        playThreeScene.children = [];
        const [playerCamera] = playerCameraIndex.entities;
        const { fov, aspectRatio, near, far } = playerCamera.getComponent(components.CameraEnum).value;
        //console.log('cam',fov);
        const playThreeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        playThreeCamera.position.set(0, 0, 5);

        for (const thingEnt of thingIndex.entities) {
          const geoComp = thingEnt.getComponent(components.Geometry);
          const matComp = thingEnt.getComponent(components.MaterialEnum);
          const threeGeo = new THREE.Geometry();
          threeGeo.vertices = geoComp.vertices;
          threeGeo.faces = geoComp.faces;
          // TODO get actual material (+ standard)
          const threeMat = new THREE.MeshBasicMaterial({ color: matComp.value.color });
          const threeMesh = new THREE.Mesh(threeGeo, threeMat);
          playThreeScene.add(threeMesh);
        }

        playThreeRenderer.render(playThreeScene, playThreeCamera);
      }
    },
    [
      new IndexSpec([
        components.CameraEnum,
        components.IsMainPlayerCamera
      ]),
      new IndexSpec([
        components.CameraEnum,
        components.IsMainDebugCamera
      ]),
      new IndexSpec([
        components.Geometry,
        components.MaterialEnum,
      ])
    ]
  );

  return render;
};

export default getRenderSystem;
