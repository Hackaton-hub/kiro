import { CONTRACT_VERSION } from './types.js';
import type { CheckContext, PackageRef, Signal, Verdict } from './types.js';

export const POLICY_VERSION = '0.1.0';

export function judge(ref: PackageRef, signals: Signal[], ctx: CheckContext): Verdict {
  const notFound = signals.find((s) => s.id === 'registry.not_found');
  const base = {
    contractVersion: CONTRACT_VERSION,
    package: ref,
    signals,
    seams: [],
    policyVersion: POLICY_VERSION,
    checkedAt: ctx.now.toISOString(),
    demo: ctx.offline,
  };

  if (notFound) {
    // The signal summary is free text, so fall back to a fixed sentence if it is blank.
    const reason = notFound.summary.trim() || `This package does not exist on ${ref.ecosystem}.`;
    return {
      ...base,
      action: 'BLOCK',
      diagnosis: 'GHOST',
      headline: `Ghost detected: this package does not exist on ${ref.ecosystem}.`,
      reasons: [reason],
    };
  }

  return {
    ...base,
    action: 'ALLOW',
    diagnosis: 'LIVING',
    headline: 'No problem found: safe to install.',
    reasons: [],
  };
}
