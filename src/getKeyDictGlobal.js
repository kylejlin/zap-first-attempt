const getKeyDictGlobal = () => {
  const keyDict = {};
  window.addEventListener('keydown', ({ keyCode }) => {
    keyDict[keyCode] = true;
  });
  window.addEventListener('keyup', ({ keyCode }) => {
    keyDict[keyCode] = false;
  });
  return keyDict;
};

export default getKeyDictGlobal;
