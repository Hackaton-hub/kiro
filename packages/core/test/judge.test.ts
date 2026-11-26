import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { judge } from '../src/judge.js';
import { CONTRACT_VERSION } from '../src/types.js';
import type { CheckContext, PackageRef, Signal, SignalId } from '../src/types.js';

const ref: PackageRef = { ecosystem: 'npm', name: 'demo-ghost-lib', normalizedName: 'demo-ghost-lib', source: 'cli' };
const ctx: CheckContext = { now: new Date('2026-11-26T10:00:00Z'), offline: true, timeoutMs: 4000 };

const signal = (id: SignalId, summary = 'Some summary.'): Signal => ({
  id,
  organ: 'registry',
  strength: 'decisive',
  summary,
  evidence: [{ label: 'lookup', value: '404', source: 'registry', observedAt: '2026-11-26T10:00:00Z' }],
});

describe('judge', () => {
  it('blocks a ghost when registry.not_found is present', () => {
    const v = judge(ref, [signal('registry.not_found', 'Not found on npm.')], ctx);
    expect(v.action).toBe('BLOCK');
    expect(v.diagnosis).toBe('GHOST');
    expect(v.reasons).toEqual(['Not found on npm.']);
    expect(v.contractVersion).toBe(CONTRACT_VERSION);
    expect(v.policyVersion).toBe('0.1.0');
    expect(v.seams).toEqual([]);
    expect(v.demo).toBe(true);
    expect(v.headline.length).toBeLessThanOrEqual(80);
  });

  it('allows a package with no registry.not_found signal', () => {
    const v = judge(ref, [], { ...ctx, offline: false });
    expect(v.action).toBe('ALLOW');
    expect(v.diagnosis).toBe('LIVING');
    expect(v.demo).toBe(false);
    expect(v.headline.length).toBeLessThanOrEqual(80);
  });

  it('gives every non-ALLOW verdict at least one reason', () => {
    const ids: SignalId[] = ['registry.not_found', 'registry.young', 'osv.malware', 'net.unreachable'];
    const signalArb = fc
      .record({ id: fc.constantFrom(...ids), summary: fc.string() })
      .map(({ id, summary }) => signal(id, summary));
    fc.assert(
      fc.property(fc.array(signalArb), fc.boolean(), (signals, offline) => {
        const v = judge(ref, signals, { ...ctx, offline });
        if (v.action !== 'ALLOW') {
          expect(v.reasons.length).toBeGreaterThanOrEqual(1);
          expect(v.reasons.every((r) => r.trim().length > 0)).toBe(true);
        }
        expect(v.headline.length).toBeLessThanOrEqual(80);
      }),
    );
  });
});
