import { expect, it } from 'vitest';
import { main } from '../src/index.js';
it('runs', async () => {
  await expect(main()).resolves.toBe(0);
});
