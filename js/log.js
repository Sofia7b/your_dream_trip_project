export function log({
  level = 'INFO',
  target = 'console',
  profile = false,
} = {}) {
  return function decorator(fn) {
    return async function wrapped(...args) {
      const start = profile ? Date.now() : null;

      if (level !== 'ERROR') {
        if (level === 'DEBUG') {
          console.log(
            `${new Date().toLocaleString()} ${level} Calling ${
              fn.name
            } with args:`,
            args
          );
        } else {
          //info
          console.log(
            `${new Date().toLocaleString()} ${level} ${fn.name} called`
          );
        }
      }

      try {
        const result = fn.apply(this, args);
        const value = result instanceof Promise ? await result : result;

        if (level !== 'ERROR') {
          const duration = profile ? Date.now() - start : undefined;

          if (level === 'DEBUG') {
            console.log(
              `${new Date().toLocaleString()} ${level} Result of ${fn.name}:`,
              value,
              duration != null ? `(${duration}ms)` : ''
            );
          } else {
            console.log(
              `${new Date().toLocaleString()} ${level} ${fn.name} completed`,
              duration != null ? `(${duration}ms)` : ''
            );
          }
        }

        return value;
      } catch (err) {
        console.error(`[ERROR] Error ${fn.name}:`, err);
        throw err;
      }
    };
  };
}
