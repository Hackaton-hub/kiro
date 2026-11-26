import type { CheckContext, PackageRef, Signal, SignalProvider } from '../types.js';

export const ledgerProvider: SignalProvider = {
  organ: 'ledger',
  async collect(_ref: PackageRef, _ctx: CheckContext): Promise<Signal[]> {
    return [];
  },
};
