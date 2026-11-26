import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const grimoireProvider: SignalProvider = {
  organ: 'grimoire',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
