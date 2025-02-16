const lazy = async  (loader) => {
  lazy.loaderArr = [...lazy.loaderArr, loader];
  return loader;
};
lazy.loaderArr = [];

const preloadReady = (onSuccess = () => {}, onError = () => {}) => {
  const promiseArr = [];
  for (let item of lazy.loaderArr) {
    promiseArr.push(item);
  }

  return Promise.all(promiseArr)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      onError(error);
      throw new Error(error);
    });
};

export {preloadReady};
export {lazy};
export default lazy;
