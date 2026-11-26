import { registryProvider } from '@phantom/core';
import type { CheckContext, PackageRef, Signal } from '@phantom/core';

// Placeholder inputs until the real MCP tools are wired in.
const stubRef: PackageRef = {
  ecosystem: 'npm',
  name: 'example',
  normalizedName: 'example',
  source: 'mcp',
};
const stubCtx: CheckContext = { now: new Date(), offline: true, timeoutMs: 4000 };

export async function listSources(): Promise<Signal[]> {
  return registryProvider.collect(stubRef, stubCtx);
}
