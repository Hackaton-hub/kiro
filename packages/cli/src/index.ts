import { registryProvider } from '@phantom/core';

export function main(): number {
  return registryProvider.collect().length;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || process.argv[1]?.endsWith('index.ts')) {
  console.log('phantom demo: nothing to show yet');
}
