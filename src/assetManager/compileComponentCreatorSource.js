import { transform } from '@babel/standalone';

// TODO: This is almost identical to compileSystem.
// For the sake of DRY, refactor later.

const compileComponentCreatorSource = (src) => {
  const transformed = transform(
    src,
    {
      presets: ['es2015']
    }
  ).code;
  const funcWrapped = '(function(require,exports){' + transformed + '})';
  let func;
  try {
    func = eval(funcWrapped);
  } catch (e) {
    func = () => {
      throw e;
    };
  }
  // TODO
  const requireOverride = () => {
    throw new Error('You should not be importing anything in a component creator.');
  };
  const exportsOverride = {};
  try {
    func(requireOverride, exportsOverride);
    return exportsOverride.default;
  } catch (e) {
    return null;
  }
};

export default compileComponentCreatorSource;
