export function log({
  level = 'INFO',
  target = 'console',
  profile = false,
} = {}) {
  return function decorator(fn) {
    return async function wrapped(...args) {
      const ts = new Date().toLocaleString();
      const start = profile ? Date.now() : 0;

      if (level !== 'ERROR') {
        console.log(
          `${ts} ${level} ${fn.name} ` +
            (level === 'DEBUG' ? `args: ${JSON.stringify(args)}` : 'called')
        );
      }

      try {
        const value = await fn.apply(this, args);
        if (level !== 'ERROR') {
          const dur = profile ? ` (${Date.now() - start}ms)` : '';
          console.log(
            `${ts} ${level} ${fn.name} ` +
              (level === 'DEBUG'
                ? `result: ${JSON.stringify(value)}${dur}`
                : `completed${dur}`)
          );
        }

        return value;
      } catch (err) {
        console.error(`${ts} ERROR ${fn.name} failed:`, err);
        throw err;
      }
    };
  };
}
