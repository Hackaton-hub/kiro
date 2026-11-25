import { expect, it } from 'vitest';
import { listSources } from '../src/index.js';

it('runs', () => {
  expect(listSources()).toEqual([]);
});
