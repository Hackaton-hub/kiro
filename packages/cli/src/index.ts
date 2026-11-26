import { registryProvider } from '@phantom/core';
import type { CheckContext, PackageRef } from '@phantom/core';

// Placeholder inputs until the real command parsing is wired in.
const stubRef: PackageRef = {
  ecosystem: 'npm',
  name: 'example',
  normalizedName: 'example',
  source: 'cli',
};
const stubCtx: CheckContext = { now: new Date(), offline: true, timeoutMs: 4000 };

export async function main(): Promise<number> {
  const signals = await registryProvider.collect(stubRef, stubCtx);
  return signals.length;
}
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || process.argv[1]?.endsWith('index.ts')) {
  console.log('phantom demo: nothing to show yet');
}
