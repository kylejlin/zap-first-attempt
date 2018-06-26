class IndexSpec {
  constructor(requirements) {
    this.requirements = requirements;
    this.name = requirements.sort().join(',');
  }
}

export default IndexSpec;
