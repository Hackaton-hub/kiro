import { registryProvider } from '@phantom/core';

export function listSources(): unknown[] {
  return registryProvider.collect();
}
