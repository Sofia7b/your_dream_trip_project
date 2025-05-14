// Task: 5
// Асинхронна версія map з підтримкою скасування (callback)
Array.prototype.mapAsyncAbortable = function(callback, signal, completionCallback) {
  if (typeof signal === "function") {
    completionCallback = signal;
    signal = null;
  }

  let aborted = false;

  if (signal && signal instanceof AbortSignal) {
    if (signal.aborted) {
      return completionCallback(new Error("Операція була скасована"));
    }

    signal.addEventListener("abort", () => {
      aborted = true;
      completionCallback(new Error("Операція була скасована"));
    });
  }

  try {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (aborted || (signal?.aborted)) {
        return completionCallback(new Error("Операція була скасована"));
      }
      result.push(callback(this[i], i, this));
    }
    completionCallback(null, result);
  } catch (error) {
    completionCallback(error);
  }
};

// Promise-версія map з підтримкою скасування
Array.prototype.mapPromiseAbortable = function(callback, signal) {
  return new Promise(async (resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("Операція була скасована"));
    }

    const abortHandler = () => {
      reject(new Error("Операція була скасована"));
    };
    signal?.addEventListener('abort', abortHandler);

    try {
      const results = [];
      for (let i = 0; i < this.length; i++) {
        if (signal?.aborted) {
          throw new Error("Операція була скасована");
        }
        results.push(await callback(this[i], i, this));
      }
      resolve(results);
    } catch (error) {
      reject(error);
    } finally {
      signal?.removeEventListener('abort', abortHandler);
    }
  });
};

 // Доп. функція для імітації асинхронних операцій
export function simulateAsyncOperation(value, delay = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}
