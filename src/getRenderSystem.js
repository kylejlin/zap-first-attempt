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

  const renderSystem = new System(
    'Render',
    (scene, [playerCameraIndex, debugCameraIndex, thingIndex]) => {
      renderOnPreviewCamera: {
        previewThreeScene.children = [];
        const [debugCamera] = debugCameraIndex.entities;
        if (!debugCamera) {
          break renderOnPreviewCamera;
        }
        const { fov, aspectRatio, near, far } = debugCamera.getComponent(components.CameraEnum).value;
        const { x: px, y: py, z: pz } = debugCamera.getComponent(components.Position);
        const { x: rx, y: ry, z: rz, order: ro } = debugCamera.getComponent(components.Rotation);
        const { x: sx, y: sy, z: sz } = debugCamera.getComponent(components.Scale);
        const debugThreeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        debugThreeCamera.position.set(px, py, pz);
        debugThreeCamera.rotation.set(rx, ry, rz, ro);
        debugThreeCamera.scale.set(sx, sy, sz);

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

        previewThreeRenderer.render(previewThreeScene, debugThreeCamera);
      }

      renderOnPlayCamera: {
        playThreeScene.children = [];
        const [playerCamera] = playerCameraIndex.entities;
        if (!playerCamera) {
          break renderOnPlayCamera;
        }
        const { fov, aspectRatio, near, far } = playerCamera.getComponent(components.CameraEnum).value;
        const { x: px, y: py, z: pz } = playerCamera.getComponent(components.Position);
        const { x: rx, y: ry, z: rz, order: ro } = playerCamera.getComponent(components.Rotation);
        const { x: sx, y: sy, z: sz } = playerCamera.getComponent(components.Scale);
        const playThreeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        playThreeCamera.position.set(px, py, pz);
        playThreeCamera.rotation.set(rx, ry, rz, ro);
        playThreeCamera.scale.set(sx, sy, sz);

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
        components.IsMainPlayerCamera,
        components.Position,
        components.Rotation,
        components.Scale
      ]),
      new IndexSpec([
        components.CameraEnum,
        components.IsMainDebugCamera,
        components.Position,
        components.Rotation,
        components.Scale
      ]),
      new IndexSpec([
        components.Geometry,
        components.MaterialEnum,
      ])
    ]
  );

  return renderSystem;
};

export default getRenderSystem;
