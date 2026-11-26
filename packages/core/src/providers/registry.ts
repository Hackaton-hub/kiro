import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const registryProvider: SignalProvider = {
  organ: 'registry',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
