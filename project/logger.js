const fs = require("fs");
const path = require("path");

function logWrapper(
  fn,
  options = {
    level: "INFO",
    logToFile: false,
  }
) {
  return async function (...args) {
    const { level, logToFile } = options;
    const timestamp = new Date().toISOString();
    const functionName = fn.name || "anonymous";
    const log = (message, type = "INFO") => {
      const logMessage = `[${timestamp}] [${type}], [${functionName}], ${message}`;
      if (logToFile) {
        fs.appendFileSync(path.join(__dirname, "app.log"), logMessage + "\n");
      } else {
        console.log(logMessage);
      }
    }

    try {
      log(`call with args: ${JSON.stringify(args)}`, level);
      const start = performance.now?.() || Date.now();
      const result = await fn(...args);
      const end = performance.now?.() || Date.now();
      log(
        `result: ${JSON.stringify(result)} (time to end: ${(
          end - start
        ).toFixed(2)}ms)`,
        level
      );
      return result;
    } catch (error) {
      log(`error: ${error.message}`, error);
      throw error;
    }
  };
}
module.exports = { logWrapper };
