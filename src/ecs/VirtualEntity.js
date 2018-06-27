class VirtualEntity {
  constructor() {
    Object.defineProperties(this, {
      componentProviders: {
        value: {},
        enumerable: false,
      },
      isEntity: {
        value: true,
        enumerable: false,
      },
      isVirtual: {
        value: true,
        enumerable: false,
      },
    });
  }

  addComponent(component) {
    this[component.name] = component;
  }

  removeComponent(component) {
    this[component.name] = null;
  }

  addComponentProvider(provider) {
    this.componentProviders[provider.name] = provider;
  }

  removeComponentProvider(provider) {
    this.componentProviders[provider.name] = null;
  }
}

export default VirtualEntity;
