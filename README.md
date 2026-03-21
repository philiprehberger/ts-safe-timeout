# @philiprehberger/safe-timeout

[![CI](https://github.com/philiprehberger/ts-safe-timeout/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-safe-timeout/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/safe-timeout.svg)](https://www.npmjs.com/package/@philiprehberger/safe-timeout)
[![License](https://img.shields.io/github/license/philiprehberger/ts-safe-timeout)](LICENSE)

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

## API

| Export | Description |
|--------|-------------|
| `withTimeout(promise, ms, options?)` | Race promise against timeout, throws `TimeoutError` on timeout |
| `withTimeoutFallback(promise, ms, fallback)` | Returns fallback value on timeout instead of throwing |
| `createTimeoutSignal(ms)` | Creates an `AbortSignal` that aborts after `ms` |
| `TimeoutError` | Error class thrown on timeout, has `ms` property |

### `TimeoutOptions`

| Option | Type | Description |
|--------|------|-------------|
| `signal` | `AbortSignal` | External abort signal |
| `onTimeout` | `() => void` | Callback when timeout fires |


## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
