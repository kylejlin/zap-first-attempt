import { transform } from '@babel/standalone';
import System from './ecs/System';
import IndexSpec from './ecs/IndexSpec';

const compileSystem = (src) => {
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
    return {
      System,
      IndexSpec,
    };
  };
  const exportsOverride = {};
  try {
    func(requireOverride, exportsOverride);
    return exportsOverride.default;
  } catch (e) {
    return null;
  }
};

export default compileSystem;
