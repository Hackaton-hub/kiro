import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import * as core from '../src/index.js';

describe('core', () => {
  it('every provider collects nothing', () => {
    const providers = Object.entries(core).filter(([k]) => k.endsWith('Provider'));
    expect(providers).toHaveLength(8);
    for (const [, p] of providers) expect((p as { collect(): unknown[] }).collect()).toEqual([]);
  });

  it('fast-check is wired', () => {
    fc.assert(fc.property(fc.integer(), (n) => n + 0 === n));
  });
});