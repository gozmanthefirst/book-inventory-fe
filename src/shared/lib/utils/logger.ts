export const logger = {
  error: (message: string, meta?: object) => {
    console.error(`ERROR: ${message}`, meta);
  },
  info: (message: string, meta?: object) => {
    console.log(`INFO: ${message}`, meta);
  },
};
