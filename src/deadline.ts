import { TimeoutError } from './types.js';
import type { TimeoutOptions } from './types.js';
import { withTimeout } from './timeout.js';

/**
 * Wraps a promise with an absolute deadline instead of a relative duration.
 * Rejects with `TimeoutError` if the deadline passes before the promise settles.
 */
export function withDeadline<T>(
  promise: Promise<T>,
  deadline: Date,
  options?: TimeoutOptions,
): Promise<T> {
  const remaining = deadline.getTime() - Date.now();

  if (remaining <= 0) {
    options?.onTimeout?.();
    return Promise.reject(new TimeoutError(0));
  }

  return withTimeout(promise, remaining, options);
}
