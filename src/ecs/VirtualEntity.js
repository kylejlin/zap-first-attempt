class VirtualEntity {
  constructor() {
    this.componentProviders = {};
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
