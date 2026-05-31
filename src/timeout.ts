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

/**
 * Runs an async operation with a timeout, providing it an `AbortSignal`
 * that is aborted when the timeout fires. This lets callers cancel upstream
 * work without manually wiring an `AbortController`.
 *
 * The returned `AbortController` is also exposed so callers can perform
 * cleanup that depends on its state (e.g. checking `controller.signal.aborted`)
 * or share the signal with sibling operations.
 *
 * On timeout, the controller is aborted with a `TimeoutError` and the
 * returned promise rejects with that same `TimeoutError`.
 */
export async function withTimeoutAbort<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms: number,
  options?: TimeoutOptions,
): Promise<{ result: T; controller: AbortController }> {
  const controller = new AbortController();

  const onExternalAbort = (): void => {
    controller.abort(options?.signal?.reason);
  };

  if (options?.signal) {
    if (options.signal.aborted) {
      controller.abort(options.signal.reason);
    } else {
      options.signal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  try {
    const result = await withTimeout(fn(controller.signal), ms, {
      signal: options?.signal,
      onTimeout: () => {
        controller.abort(new TimeoutError(ms));
        options?.onTimeout?.();
      },
    });
    return { result, controller };
  } finally {
    options?.signal?.removeEventListener('abort', onExternalAbort);
  }
}
