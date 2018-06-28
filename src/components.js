export const Position = (x = 0, y = 0, z = 0) => ({
  name: 'Position',
  x,
  y,
  z,
});

export const Rotation = (x = 0, y = 0, z = 0, order = 'XYZ') => ({
  name: 'Rotation',
  x,
  y,
  z,
  order,
});

export const Scale = (x = 1, y = 1, z = 1) => ({
  name: 'Scale',
  x,
  y,
  z,
});

export const Geometry = (vertices = [], faces = []) => ({
  name: 'Geometry',
  vertices,
  faces,
});

export const MaterialEnum = (
  which = MaterialEnum.Which.StandardColor,
  value = { color: 0xFFA500 }
) => ({
  name: 'MaterialEnum',
  which,
  value,
});
MaterialEnum.Which = {
  // { color: Int }
  StandardColor: 'StandardColor',
};

export const CameraEnum = (
  which = CameraEnum.Which.Perspective,
  value = { fov: 75, aspectRatio: 1, near: 0.1, far: 1000 }
) => ({
  name: 'CameraEnum',
  which,
  value,
});
CameraEnum.Which = {
  // { fov: Float, aspect: Float, near: Float, far: Float }
  Perspective: 'Perspective',
};

export const IsMainPlayerCamera = () => ({
  name: 'IsMainPlayerCamera',
});

export const IsMainDebugCamera = () => ({
  name: 'IsMainDebugCamera',
});

export const InspectorName = (inspectorName = 'MyAwesomeEntity') => ({
  name: 'InspectorName',
  inspectorName,
});
