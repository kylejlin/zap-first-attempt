import compileComponentCreatorSource from './compileComponentCreatorSource';

class AssetManager {
  constructor() {
    this.componentCreatorSources = {};
    this.componentProviderSources = {};
    this.componentCreators = {};
    this.componentProviders = {};
  }

  addComponentCreatorSource(creatorSource) {
    const creator = compileComponentCreatorSource(creatorSource.src);
    if (creator === null) {
      throw new Error('Could not compile component creator.');
    }
    const creatorName = creator().name
    creatorSource.name = creatorName;
    this.componentCreatorSources[creatorName] = creatorSource;
    this.componentCreators[creatorName] = creator;
  }
}

export default AssetManager;
