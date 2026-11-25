import { expect, it } from 'vitest';
import { main } from '../src/index.js';

it('runs', () => {
  expect(main()).toBe(0);
});
