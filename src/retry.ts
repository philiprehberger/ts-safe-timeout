import { TimeoutError } from './types.js';
import type { TimeoutRetryOptions } from './types.js';
import { withTimeout } from './timeout.js';

/**
 * Retries an async function with increasing timeout on each attempt.
 * The timeout grows by `backoffMultiplier` on each retry.
 */
export async function withTimeoutRetry<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  options: TimeoutRetryOptions,
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const backoffMultiplier = options.backoffMultiplier ?? 2;
  let currentTimeout = options.timeoutMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await withTimeout(fn(options.signal), currentTimeout, {
        signal: options.signal,
      });
    } catch (error) {
      if (error instanceof TimeoutError) {
        options.onTimeout?.(attempt, currentTimeout);

        if (attempt < maxRetries) {
          currentTimeout = Math.round(currentTimeout * backoffMultiplier);
          continue;
        }
      }
      throw error;
    }
  }

  // Unreachable, but satisfies TypeScript
  throw new TimeoutError(currentTimeout);
}
