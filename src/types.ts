export interface TimeoutOptions {
  signal?: AbortSignal;
  onTimeout?: () => void;
}

export class TimeoutError extends Error {
  public readonly ms: number;

  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = 'TimeoutError';
    this.ms = ms;
  }
}
