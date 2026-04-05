# Changelog

## 0.2.1

- Fix README GitHub URLs to use correct repo name (ts-safe-timeout)

## 0.2.0

- Add timeout retry wrapper with configurable backoff
- Add onTimeout callback for custom timeout handling
- Add deadline mode with absolute timestamp support
- Add TimeoutTracker for timeout statistics and monitoring

## 0.1.6

- Standardize README to 3-badge format with emoji Support section
- Update CI actions to v5 for Node.js 24 compatibility
- Add GitHub issue templates, dependabot config, and PR template

## 0.1.5

- Republish under new npm package name

## 0.1.4

- Add Development section to README
- Fix CI badge to reference publish.yml
- Add test script to package.json

## 0.1.0
- Initial release
- `withTimeout()` for promise timeout with error
- `withTimeoutFallback()` for promise timeout with fallback value
- `createTimeoutSignal()` helper for AbortSignal creation
- `TimeoutError` class
