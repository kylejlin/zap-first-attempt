class Entity {
  constructor() {
    this.scene = null;
    Object.defineProperties(this, {
      isEntity: {
        value: true,
        enumerable: false,
      },
    });
  }

  addComponent(component) {
    this[component.name] = component;

    const { scene } = this;
    if (scene) {
      for (const index of scene.indexes) {
        if (index.entities.includes(this)) {
          continue;
        }

        let hasAll = true;
        for (const requirement of index.requirements) {
          const component = this[requirement];
          if (component === null || component === undefined) {
            hasAll = false;
            break;
          }
        }
        if (hasAll) {
          index.entities.push(this);
        }
      }
    }
  }

  removeComponent(component) {
    this[component.name] = null;

    const { scene } = this;
    if (scene) {
      for (const index of scene.indexes) {
        const i = index.entities.indexOf(this);
        if (i === -1) {
          continue;
        }

        let hasAll = true;
        for (const requirement of index.requirements) {
          const component = this[requirement];
          if (component === null || component === undefined) {
            hasAll = false;
            break;
          }
        }
        if (!hasAll) {
          index.entities.splice(i);
        }
      }
    }
  }
}

export default Entity;
