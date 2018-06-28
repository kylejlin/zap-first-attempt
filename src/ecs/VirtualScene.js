import VirtualEntity from './VirtualEntity';
import Scene from './Scene';
import Entity from './Entity';
import compileSystem from '../compileSystem';

class VirtualScene {
  constructor() {
    this.isVirtual = true;
    this.entities = [];
    this.systems = [];
    this.globals = {};
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    const i = this.entities.indexOf(entity);
    if (i === -1) {
      throw new Error('Entity is not part of virtual scene.');
    }
    this.entities.splice(i, 1);
  }

  addSystem(system) {
    this.systems.push(system);
  }

  removeSystem(system) {
    const i = this.systems.indexOf(system);
    if (i === -1) {
      throw new Error('System is not part of virtual scene.');
    }
    this.systems.splice(i, 1);
  }

  intoScene() {
    const scene = this.intoSceneWithoutSystems();
    for (const virtualSystem of this.systems) {
      const system = compileSystem(virtualSystem.src);
      if (system === null) {
        throw new SyntaxError('Could not compile virtual system.');
      }
      scene.addSystem(system);
      virtualSystem.name = system.name;
    }
    return scene;
  }

  intoSceneWithoutSystems() {
    const scene = new Scene();
    for (const virtualEntity of this.entities) {
      const entity = new Entity();
      const derivedComponents = {};
      for (const providerName in virtualEntity.componentProviders) {
        const provider = virtualEntity.componentProviders[providerName];
        derivedComponents[providerName] = provider.getComponents();
      }
      for (const componentName in virtualEntity) {
        const component = virtualEntity[componentName];
        if (component === null || component === undefined) {
          continue;
        }
        if (component.isDerived) {
          const { providerName, name } = component;
          const rawComponent = derivedComponents[providerName][name];
          const rawComponentClone = JSON.parse(JSON.stringify(rawComponent));
          entity.addComponent(rawComponentClone);
        } else {
          const rawComponentClone = JSON.parse(JSON.stringify(component));
          entity.addComponent(rawComponentClone);
        }
      }
      scene.addEntity(entity);
    }
    return scene;
  }
}

export default VirtualScene;
