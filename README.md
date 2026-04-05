# @philiprehberger/safe-timeout

[![CI](https://github.com/philiprehberger/ts-safe-timeout/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-safe-timeout/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/safe-timeout.svg)](https://www.npmjs.com/package/@philiprehberger/safe-timeout)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-safe-timeout)](https://github.com/philiprehberger/ts-safe-timeout/commits/main)

Reliable timeout wrapper for async operations with AbortController support

## Installation

```bash
npm install @philiprehberger/safe-timeout
```

## Usage

### Timeout with Error

```ts
import { withTimeout, TimeoutError } from '@philiprehberger/safe-timeout';

try {
  const data = await withTimeout(fetch('/api/data'), 5000);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log('Request timed out');
  }
}
```

### Timeout with Fallback

```ts
import { withTimeoutFallback } from '@philiprehberger/safe-timeout';

const data = await withTimeoutFallback(fetch('/api/data'), 5000, cachedData);
// Returns cachedData if the fetch takes longer than 5 seconds
```

### Timeout Signal

```ts
import { createTimeoutSignal } from '@philiprehberger/safe-timeout';

const signal = createTimeoutSignal(5000);
const response = await fetch('/api/data', { signal });
```

### With Options

```ts
const data = await withTimeout(fetch('/api'), 5000, {
  signal: existingAbortSignal,  // Also abort on external signal
  onTimeout: () => console.warn('Operation timed out'),
});
```

### Timeout Retry

```ts
import { withTimeoutRetry } from '@philiprehberger/safe-timeout';

const data = await withTimeoutRetry(
  (signal) => fetch('/api/data', { signal }),
  {
    timeoutMs: 2000,
    maxRetries: 3,
    backoffMultiplier: 2,  // 2s -> 4s -> 8s -> 16s
    onTimeout: (attempt, ms) => {
      console.warn(`Attempt ${attempt} timed out after ${ms}ms`);
    },
  },
);
```

### Deadline Mode

```ts
import { withDeadline } from '@philiprehberger/safe-timeout';

// Must complete by an absolute time
const deadline = new Date('2026-04-01T00:00:00Z');
const data = await withDeadline(fetch('/api/data'), deadline);
```

### Timeout Statistics

```ts
import { TimeoutTracker } from '@philiprehberger/safe-timeout';

const tracker = new TimeoutTracker();

await tracker.run(fetch('/api/users'), 3000);
await tracker.run(fetch('/api/posts'), 3000);

const stats = tracker.stats;
console.log(`Success rate: ${(stats.successRate * 100).toFixed(1)}%`);
console.log(`Avg duration: ${stats.averageDurationMs}ms`);
console.log(`Timeouts: ${stats.timeouts}/${stats.totalCalls}`);

// Reset when needed
tracker.reset();
```

## API

| Export | Description |
|--------|-------------|
| `withTimeout(promise, ms, options?)` | Race promise against timeout, throws `TimeoutError` on timeout |
| `withTimeoutFallback(promise, ms, fallback)` | Returns fallback value on timeout instead of throwing |
| `withTimeoutRetry(fn, options)` | Retry an async function with increasing timeout on each attempt |
| `withDeadline(promise, deadline, options?)` | Race promise against an absolute `Date` deadline |
| `createTimeoutSignal(ms)` | Creates an `AbortSignal` that aborts after `ms` |
| `TimeoutTracker` | Class that tracks timeout frequency, success rate, and average duration |
| `TimeoutError` | Error class thrown on timeout, has `ms` property |

### `TimeoutOptions`

| Option | Type | Description |
|--------|------|-------------|
| `signal` | `AbortSignal` | External abort signal |
| `onTimeout` | `() => void` | Callback when timeout fires |

### `TimeoutRetryOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeoutMs` | `number` | (required) | Initial timeout in milliseconds |
| `maxRetries` | `number` | `3` | Maximum number of retries after timeout |
| `backoffMultiplier` | `number` | `2` | Multiplier applied to timeout on each retry |
| `signal` | `AbortSignal` | — | External abort signal |
| `onTimeout` | `(attempt, ms) => void` | — | Callback on each timeout before retrying |

### `TimeoutStats`

| Property | Type | Description |
|----------|------|-------------|
| `totalCalls` | `number` | Total number of tracked calls |
| `successes` | `number` | Calls that completed within timeout |
| `timeouts` | `number` | Calls that timed out |
| `errors` | `number` | Calls that failed with non-timeout errors |
| `successRate` | `number` | Success ratio (0 to 1) |
| `timeoutRate` | `number` | Timeout ratio (0 to 1) |
| `averageDurationMs` | `number` | Average duration of successful calls in ms |

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-safe-timeout)

🐛 [Report issues](https://github.com/philiprehberger/ts-safe-timeout/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-safe-timeout/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
