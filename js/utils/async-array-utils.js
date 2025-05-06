// Task: 5
/**
 * Асинхронна версія map з підтримкою скасування (callback)
 */
Array.prototype.mapAsyncAbortable = function(callback, signal, completionCallback) {
  // Обробка випадку, коли signal передано як функція (для зворотньої сумісності)
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
      // Застосування callback до поточного елемента
      result.push(callback(this[i], i, this));
    }
    completionCallback(null, result);
  } catch (error) {
    // Обробка помилок під час виконання
    completionCallback(error);
  }
};



/**
 * Promise-версія map з підтримкою скасування
 * 2. Підтримка async/await
 * 3. Механізм скасування через AbortSignal
 * 4. Послідовне виконання асинхронних операцій
 */
Array.prototype.mapPromiseAbortable = function(callback, signal) {
  return new Promise(async (resolve, reject) => {
     // Перевірка скасування при старті
    if (signal?.aborted) {
      return reject(new Error("Операція була скасована"));
    }

    const abortHandler = () => {
      reject(new Error("Операція була скасована"));
    };
    // Підписка на подію скасування
    signal?.addEventListener('abort', abortHandler);

    try {
      const results = [];
      // Асинхронна обробка елементів
      for (let i = 0; i < this.length; i++) {
        if (signal?.aborted) {
          throw new Error("Операція була скасована");
        }
        // Очікування результату асинхронного callback
        results.push(await callback(this[i], i, this));
      }
      // Успішне вирішення Promise
      resolve(results);
    } catch (error) {
      // Відхилення Promise у разі помилки
      reject(error);
    } finally {
      signal?.removeEventListener('abort', abortHandler);
    }
  });
};

/**
 * Допоміжна функція для імітації асинхронних операцій
 * Використовується для демонстрації роботи методів
 * @param {*} value - значення для повернення
 * @param {number} delay - затримка в мілісекундах (за замовчуванням 500)
 * @returns {Promise} - Promise, який вирішується після затримки
 */
export function simulateAsyncOperation(value, delay = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}
