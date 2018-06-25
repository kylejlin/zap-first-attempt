//! unused

export class Gravity {
  constructor(direction, magnitude) {
    // @type UnitVector
    this.direction = direction;
    // @type Float
    this.magnitude = magnitude;
  }
}

export class Position {
  constructor(x, y, z) {
    // @type Float
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Velocity {
  constructor(x, y, z) {
    // @type Float
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Rotation {
  constructor(x, y, z) {
    // @type Float
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Geometry {
  constructor(vertices, faces) {
    this.vertices = vertices;
    this.faces = faces;
  }
}

export class MaterialEnum {
  static Which = {
    // { color: Int }
    StandardColor: 0,
  }

  constructor(which, value) {
    this.which = which;
    this.value = value;
  }
}

export class CameraEnum {
  static Which = {
    // { fov: Float, aspect: Float, near: Float, far: Float }
    Perspective: 0,
  }

  constructor(which, value) {
    this.which = which;
    this.value = value;
  }
}