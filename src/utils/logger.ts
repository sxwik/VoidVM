export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err?: any) => console.error(`[ERROR] ${msg}`, err),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
};
