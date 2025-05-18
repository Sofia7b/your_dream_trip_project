export function log({
  level = 'INFO',
  target = 'console',
  profile = false,
} = {}) {
  return function decorator(fn) {
    return async function wrapped(...args) {
      const start = profile ? Date.now() : null;

      if (level !== 'ERROR') {
        console.log(`[${level}] Calling ${fn.name}`, args);
      }

      try {
        const result = fn.apply(this, args);
        const value = result instanceof Promise ? await result : result;

        if (level !== 'ERROR') {
          const duration = profile ? Date.now() - start : undefined;
          console.log(
            `[${level}] Result ${fn.name}:`,
            value,
            duration != null ? `(${duration}ms)` : ''
          );
        }

        return value;
      } catch (err) {
        console.error(`[ERROR] Error ${fn.name}:`, err);
        throw err;
      }
    };
  };
}
