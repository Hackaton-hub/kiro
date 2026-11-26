import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const clockProvider: SignalProvider = {
  organ: 'clock',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
