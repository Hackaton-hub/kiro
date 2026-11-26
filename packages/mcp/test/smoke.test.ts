import { expect, it } from 'vitest';
import { listSources } from '../src/index.js';
it('runs', async () => {
  await expect(listSources()).resolves.toEqual([]);
});
