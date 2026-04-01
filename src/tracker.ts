import { TimeoutError } from './types.js';
import type { TimeoutOptions, TimeoutStats } from './types.js';
import { withTimeout } from './timeout.js';

/**
 * Tracks timeout statistics across multiple async calls.
 * Provides success rate, timeout rate, and average duration metrics.
 */
export class TimeoutTracker {
  private _successes = 0;
  private _timeouts = 0;
  private _errors = 0;
  private _totalDurationMs = 0;

  /**
   * Wraps a promise with a timeout and records the outcome.
   */
  async run<T>(
    promise: Promise<T>,
    ms: number,
    options?: TimeoutOptions,
  ): Promise<T> {
    const start = Date.now();

    try {
      const result = await withTimeout(promise, ms, options);
      this._successes++;
      this._totalDurationMs += Date.now() - start;
      return result;
    } catch (error) {
      if (error instanceof TimeoutError) {
        this._timeouts++;
      } else {
        this._errors++;
      }
      throw error;
    }
  }

  /** Returns a snapshot of the current statistics. */
  get stats(): TimeoutStats {
    const totalCalls = this._successes + this._timeouts + this._errors;

    return {
      totalCalls,
      successes: this._successes,
      timeouts: this._timeouts,
      errors: this._errors,
      successRate: totalCalls === 0 ? 0 : this._successes / totalCalls,
      timeoutRate: totalCalls === 0 ? 0 : this._timeouts / totalCalls,
      averageDurationMs:
        this._successes === 0
          ? 0
          : Math.round(this._totalDurationMs / this._successes),
    };
  }

  /** Resets all tracked statistics to zero. */
  reset(): void {
    this._successes = 0;
    this._timeouts = 0;
    this._errors = 0;
    this._totalDurationMs = 0;
  }
}
