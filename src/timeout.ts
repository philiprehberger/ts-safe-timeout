import { TimeoutError } from './types.js';
import type { TimeoutOptions } from './types.js';

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  options?: TimeoutOptions,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        options?.onTimeout?.();
        reject(new TimeoutError(ms));
      }
    }, ms);

    if (options?.signal) {
      if (options.signal.aborted) {
        settled = true;
        clearTimeout(timer);
        reject(options.signal.reason ?? new DOMException('Aborted', 'AbortError'));
        return;
      }

      options.signal.addEventListener('abort', () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(options.signal!.reason ?? new DOMException('Aborted', 'AbortError'));
        }
      }, { once: true });
    }

    promise.then(
      (value) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(value);
        }
      },
      (error) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(error);
        }
      },
    );
  });
}

export async function withTimeoutFallback<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  try {
    return await withTimeout(promise, ms);
  } catch (error) {
    if (error instanceof TimeoutError) {
      return fallback;
    }
    throw error;
  }
}

export function createTimeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new TimeoutError(ms)), ms);
  return controller.signal;
}
