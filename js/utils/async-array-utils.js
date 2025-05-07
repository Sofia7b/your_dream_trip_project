Array.prototype.mapAsyncAbortable = function (
  callback,
  signal,
  completionCallback
) {
  if (typeof signal === 'function') {
    completionCallback = signal;
    signal = null;
  }
  if (typeof completionCallback !== 'function') {
    throw new Error('Операція скасована');
  }

  const sourceArray = this;

  if (signal?.aborted) {
    queueMicrotask(() => completionCallback(new Error('Операція скасована')));
    return;
  }

  if (sourceArray.length === 0) {
    queueMicrotask(() => completionCallback(null, []));
    return;
  }

  const results = new Array(sourceArray.length);
  let completedCount = 0;
  let operationFinishedOrAborted = false;
  let abortHandler = null;

  if (signal) {
    abortHandler = () => {
      if (operationFinishedOrAborted) return;
      operationFinishedOrAborted = true;
      if (signal) signal.removeEventListener('abort', abortHandler);
      completionCallback(new Error('Операція скасована'));
    };
    signal.addEventListener('abort', abortHandler);
  }

  for (let i = 0; i < sourceArray.length; i++) {
    if (operationFinishedOrAborted) {
      break;
    }
    const currentIndex = i;
    Promise.resolve(
      callback(sourceArray[currentIndex], currentIndex, sourceArray)
    )
      .then((result) => {
        if (operationFinishedOrAborted) return;
        results[currentIndex] = result;
        completedCount++;
        if (completedCount === sourceArray.length) {
          operationFinishedOrAborted = true;
          if (signal && abortHandler)
            signal.removeEventListener('abort', abortHandler);
          completionCallback(null, results);
        }
      })
      .catch((err) => {
        if (operationFinishedOrAborted) return;
        operationFinishedOrAborted = true;
        if (signal && abortHandler)
          signal.removeEventListener('abort', abortHandler);
        completionCallback(err);
      });
  }
};

Array.prototype.mapAsyncPromiseAbortable = function (callback, signal) {
  return new Promise((resolve, reject) => {
    const sourceArray = this;

    if (signal?.aborted) {
      return reject(new Error('Операція скасована'));
    }

    if (sourceArray.length === 0) {
      return resolve([]);
    }

    let abortHandler = null;
    if (signal) {
      abortHandler = () => {
        reject(new Error('Операція скасована'));
      };
      signal.addEventListener('abort', abortHandler);
    }

    const itemPromises = sourceArray.map(async (item, index, array) => {
      if (signal?.aborted) {
        throw new Error(`Операція скасована на індексі ${index}.`);
      }
      return await callback(item, index, array);
    });

    Promise.all(itemPromises)
      .then((results) => {
        if (signal && abortHandler) {
          signal.removeEventListener('abort', abortHandler);
        }
        resolve(results);
      })
      .catch((error) => {
        if (signal && abortHandler) {
          signal.removeEventListener('abort', abortHandler);
        }
        reject(error);
      });
  });
};

//доп функція для імітації асинхрон операцій

export function simulateAsyncOperation(value, delay = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}
