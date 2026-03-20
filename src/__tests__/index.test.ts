import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');

describe('safe-timeout', () => {
  it('should export withTimeout', () => {
    assert.ok(mod.withTimeout);
  });

  it('should export withTimeoutFallback', () => {
    assert.ok(mod.withTimeoutFallback);
  });

  it('should export createTimeoutSignal', () => {
    assert.ok(mod.createTimeoutSignal);
  });

  it('should export TimeoutError', () => {
    assert.ok(mod.TimeoutError);
  });
});
