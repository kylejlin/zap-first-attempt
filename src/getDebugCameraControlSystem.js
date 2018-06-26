import System from './ecs/System';
import IndexSpec from './ecs/IndexSpec';
import * as components from './components';

const getDebugCameraControlSystem = () => {
  const debugCameraControl = new System(
    'Debug Camera Controls',
    (scene, [debugCameraIndex]) => {
      console.log(scene.globals.keyDict);
    },
    [
      new IndexSpec([
        components.CameraEnum,
        components.IsMainDebugCamera,
        components.Position,
        components.Rotation,
        components.Scale
      ])
    ]
  );
  return debugCameraControl;
};

export default getDebugCameraControlSystem;
