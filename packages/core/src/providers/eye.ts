import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const eyeProvider: SignalProvider = {
  organ: 'eye',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
