export const Position = (x, y, z) => ({
  name: 'Position',
  x,
  y,
  z,
});

export const Rotation = (x, y, z, order) => ({
  name: 'Rotation',
  x,
  y,
  z,
  order,
});

export const Scale = (x, y, z) => ({
  name: 'Scale',
  x,
  y,
  z,
});

export const Geometry = (vertices, faces) => ({
  name: 'Geometry',
  vertices,
  faces,
});

export const MaterialEnum = (which, value) => ({
  name: 'MaterialEnum',
  which,
  value,
});
MaterialEnum.Which = {
  // { color: Int }
  StandardColor: 'StandardColor',
};

export const CameraEnum = (which, value) => ({
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

export const InspectorName = (inspectorName) => ({
  name: 'InspectorName',
  inspectorName,
});
