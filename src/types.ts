export interface TimeoutOptions {
  signal?: AbortSignal;
  onTimeout?: () => void;
}

export interface TimeoutRetryOptions {
  /** Maximum number of retries after timeout. Default: 3. */
  maxRetries?: number;
  /** Initial timeout in milliseconds. */
  timeoutMs: number;
  /** Backoff multiplier applied to timeout on each retry. Default: 2. */
  backoffMultiplier?: number;
  /** External abort signal. */
  signal?: AbortSignal;
  /** Callback invoked on each timeout before retrying. */
  onTimeout?: (attempt: number, ms: number) => void;
}

export interface TimeoutStats {
  /** Total number of calls tracked. */
  totalCalls: number;
  /** Number of calls that succeeded within the timeout. */
  successes: number;
  /** Number of calls that timed out. */
  timeouts: number;
  /** Number of calls that failed with a non-timeout error. */
  errors: number;
  /** Success rate as a number between 0 and 1. */
  successRate: number;
  /** Timeout rate as a number between 0 and 1. */
  timeoutRate: number;
  /** Average duration of successful calls in milliseconds. */
  averageDurationMs: number;
}

export class TimeoutError extends Error {
  public readonly ms: number;

  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = 'TimeoutError';
    this.ms = ms;
  }
}
