import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const mediumProvider: SignalProvider = {
  organ: 'medium',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
