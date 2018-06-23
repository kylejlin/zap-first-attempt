class IndexSpec {
  constructor(requirements) {
    this.requirements = requirements;
    this.name = requirements.map(f => f.name).sort().join(',');
  }
}

export default IndexSpec;
