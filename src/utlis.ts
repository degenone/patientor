export const assertNever = (value: never): never => {
  throw new Error(
    `[ERR] Should be unreachable code! (${JSON.stringify(value)})`
  );
};
