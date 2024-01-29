export class PipeError extends Error {
  constructor(message, { source } = {}) {
    super(message);
    if (source) {
      this.source = { ...source };
      source.message = message
      this.stack = source.stack
    }

    this.name = 'PipeError';
    this.message = message;
  }
}

export function pipe(value, ...fns) {
  return fns.reduce((acc, fn) => {
    try {
      return fn(acc)
    } catch (error) {
      const a = new PipeError(`pipe(${fn.name}): ${error.message}`, { source: error })
      throw a
    }
  }, value);
}
