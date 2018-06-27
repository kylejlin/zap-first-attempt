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
    (scene, [playerCameraIndex, debugCameraIndex, renderableIndex]) => {
      renderOnPreviewCamera: {
        previewThreeScene.children = [];
        const [debugCamera] = debugCameraIndex.entities;
        if (!debugCamera) {
          break renderOnPreviewCamera;
        }
        const { fov, aspectRatio, near, far } = debugCamera.CameraEnum.value;
        const { x: px, y: py, z: pz } = debugCamera.Position;
        const { x: rx, y: ry, z: rz, order: ro } = debugCamera.Rotation;
        const { x: sx, y: sy, z: sz } = debugCamera.Scale;
        const debugThreeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        debugThreeCamera.position.set(px, py, pz);
        debugThreeCamera.rotation.set(rx, ry, rz, ro);
        debugThreeCamera.scale.set(sx, sy, sz);

        for (const renderableEnt of renderableIndex.entities) {
          const geoComp = renderableEnt.Geometry;
          const matComp = renderableEnt.MaterialEnum;
          const { x: px, y: py, z: pz } = renderableEnt.Position;
          const { x: rx, y: ry, z: rz, order: ro } = renderableEnt.Rotation;
          const { x: sx, y: sy, z: sz } = renderableEnt.Scale;
          const threeGeo = new THREE.Geometry();
          threeGeo.vertices = geoComp.vertices;
          threeGeo.faces = geoComp.faces;
          // TODO get actual material (+ standard)
          const threeMat = new THREE.MeshBasicMaterial({ color: matComp.value.color });
          const threeMesh = new THREE.Mesh(threeGeo, threeMat);
          threeMesh.position.set(px, py, pz);
          threeMesh.rotation.set(rx, ry, rz, ro);
          threeMesh.scale.set(sx, sy, sz);
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
        const { fov, aspectRatio, near, far } = playerCamera.CameraEnum.value;
        const { x: px, y: py, z: pz } = playerCamera.Position;
        const { x: rx, y: ry, z: rz, order: ro } = playerCamera.Rotation;
        const { x: sx, y: sy, z: sz } = playerCamera.Scale;
        const playThreeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        playThreeCamera.position.set(px, py, pz);
        playThreeCamera.rotation.set(rx, ry, rz, ro);
        playThreeCamera.scale.set(sx, sy, sz);

        for (const renderableEnt of renderableIndex.entities) {
          const geoComp = renderableEnt.Geometry;
          const matComp = renderableEnt.MaterialEnum;
          const { x: px, y: py, z: pz } = renderableEnt.Position;
          const { x: rx, y: ry, z: rz, order: ro } = renderableEnt.Rotation;
          const { x: sx, y: sy, z: sz } = renderableEnt.Scale;
          const threeGeo = new THREE.Geometry();
          threeGeo.vertices = geoComp.vertices;
          threeGeo.faces = geoComp.faces;
          // TODO get actual material (+ standard)
          const threeMat = new THREE.MeshBasicMaterial({ color: matComp.value.color });
          const threeMesh = new THREE.Mesh(threeGeo, threeMat);
          threeMesh.position.set(px, py, pz);
          threeMesh.rotation.set(rx, ry, rz, ro);
          threeMesh.scale.set(sx, sy, sz);
          playThreeScene.add(threeMesh);
        }

        playThreeRenderer.render(playThreeScene, playThreeCamera);
      }
    },
    [
      new IndexSpec([
        'CameraEnum',
        'IsMainPlayerCamera',
        'Position',
        'Rotation',
        'Scale'
      ]),
      new IndexSpec([
        'CameraEnum',
        'IsMainDebugCamera',
        'Position',
        'Rotation',
        'Scale'
      ]),
      new IndexSpec([
        'Geometry',
        'MaterialEnum',
        'Position',
        'Rotation',
        'Scale'
      ])
    ]
  );

  return renderSystem;
};

export default getRenderSystem;
