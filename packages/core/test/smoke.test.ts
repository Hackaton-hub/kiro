import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import * as core from '../src/index.js';
import type { CheckContext, PackageRef, SignalProvider } from '../src/types.js';

const expectedOrgans: Record<string, string> = {
  registryProvider: 'registry',
  osvProvider: 'osv',
  nameProvider: 'name',
  grimoireProvider: 'grimoire',
  ledgerProvider: 'ledger',
  clockProvider: 'clock',
  mediumProvider: 'medium',
  eyeProvider: 'eye',
};

const ref: PackageRef = { ecosystem: 'npm', name: 'left-pad', normalizedName: 'left-pad', source: 'cli' };
const ctx: CheckContext = { now: new Date(0), offline: true, timeoutMs: 4000 };

describe('core', () => {
  const providers = Object.entries(core).filter(([k]) => k.endsWith('Provider')) as [string, SignalProvider][];

  it('exports the eight providers', () => {
    expect(providers.map(([k]) => k).sort()).toEqual(Object.keys(expectedOrgans).sort());
  });

  it.each(providers)('%s has the right organ and resolves to an empty array', async (key, p) => {
    expect(p.organ).toBe(expectedOrgans[key]);
    const result = p.collect(ref, ctx);
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([]);
  });

  it('fast-check is wired', () => {
    fc.assert(fc.property(fc.integer(), (n) => n + 0 === n));
  });
});
