import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const nameProvider: SignalProvider = {
  organ: 'name',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
