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

  it('should export withTimeoutAbort', () => {
    assert.ok(mod.withTimeoutAbort);
  });

  it('withTimeoutAbort resolves before timeout and leaves controller un-aborted', async () => {
    const { result, controller } = await mod.withTimeoutAbort(
      async (_signal) => {
        await new Promise((r) => setTimeout(r, 10));
        return 'ok';
      },
      100,
    );
    assert.equal(result, 'ok');
    assert.equal(controller.signal.aborted, false);
  });

  it('withTimeoutAbort rejects with TimeoutError and aborts the controller on timeout', async () => {
    let observedSignal;
    await assert.rejects(
      mod.withTimeoutAbort(
        async (signal) => {
          observedSignal = signal;
          await new Promise((r) => setTimeout(r, 200));
          return 'late';
        },
        20,
      ),
      (err) => err instanceof mod.TimeoutError,
    );
    assert.ok(observedSignal);
    assert.equal(observedSignal.aborted, true);
  });
});
