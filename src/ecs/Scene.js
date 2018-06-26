import Index from './Index';

class Scene {
  constructor() {
    this.entities = [];
    this.systems = [];
    this.indexes = [];
    this.globals = {};
  }

  addEntity(entity) {
    this.entities.push(entity);
    entity.scene = this;

    for (const index of this.indexes) {
      let hasAll = true;
      for (const requirement of index.requirements) {
        const component = entity[requirement.name];
        if (component === null || component === undefined) {
          hasAll = false;
          break;
        }
      }
      if (hasAll) {
        index.entities.push(entity);
      }
    }
  }

  removeEntity(entity) {
    const i = this.entities.indexOf(entity);
    if (i === -1) {
      throw new Error('Entity is not part of scene.');
    }
    this.entities.splice(i, 1);
    entity.scene = null;

    for (const index of this.indexes) {
      const i = index.entities.indexOf(entity);
      if (i > -1) {
        index.entities.splice(i, 1);
      }
    }
  }

  addSystem(system) {
    this.systems.push(system);

    for (const spec of system.indexSpecs) {
      // Don't create duplicate indexes.
      if (this.indexes.findIndex(index => index.name === spec.name) > -1) {
        continue;
      }

      const index = new Index(spec);
      const { requirements } = spec;
      for (const entity of this.entities) {
        let hasAll = true;
        for (const requirement of requirements) {
          const component = entity[requirement.name];
          if (component === null || component === undefined) {
            hasAll = false;
            break;
          }
        }
        if (hasAll) {
          index.entities.push(entity);
        }
      }
      this.indexes.push(index);
    }
  }

  removeSystem(system) {
    const i = this.systems.indexOf(system);
    if (i > -1) {
      this.systems.splice(i, 1);
    }
  }

  update() {
    for (const system of this.systems) {
      const systemIndexes = [];
      for (const spec of system.indexSpecs) {
        let hasFoundIndex = false;
        for (const index of this.indexes) {
          if (index.name === spec.name) {
            hasFoundIndex = true;
            systemIndexes.push(index);
            break;
          }
        }
        if (!hasFoundIndex) {
          throw new ReferenceError('Cannot find an index with name "' + spec.name + '".');
        }
      }
      system.update(this, systemIndexes);
    }
  }

  deepClone() {
    const cloneEntity = (entity) => {
      const clone = new Entity();
    };
    const cloneSystem = (system) => {

    };
    const cloneIndex = (index) => {

    };
    const cloneGlobals = (globals) => {
      console.warn('Globals are not deep-cloned yet. This is for the sake of not breaking globals reliant on closure references.');
      const clone = {};
      for (const key in globals) {
        clone[key] = globals[key];
      }
      return clone;
    };

    const clone = new Scene();
    clone.entities = this.entities.map(cloneEntity);
    clone.systems = this.systems.map(cloneSystem);
    clone.indexes = this.indexes.map(cloneIndex);
    clone.globals = cloneGlobals(this.globals);
    return clone;
  }
}

export default Scene;
