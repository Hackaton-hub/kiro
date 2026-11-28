import { describe, expect, it } from 'vitest';
import { normalize } from '../src/normalize.js';
import type { Ecosystem } from '../src/types.js';

describe('normalize: npm', () => {
  it('strips a trailing version', () => {
    expect(normalize('npm', 'react@18.2.0')).toBe('react');
  });

  it('keeps the scope and strips the version', () => {
    expect(normalize('npm', '@types/node@20')).toBe('@types/node');
  });

  it('trims and lowercases', () => {
    expect(normalize('npm', '  React  ')).toBe('react');
  });

  it('preserves -, _ and . unchanged', () => {
    expect(normalize('npm', 'left-pad')).toBe('left-pad');
    expect(normalize('npm', 'lodash_es')).toBe('lodash_es');
    expect(normalize('npm', 'chart.js')).toBe('chart.js');
    expect(normalize('npm', 'a-b_c.d')).toBe('a-b_c.d');
  });
});

describe('normalize: pypi', () => {
  it('strips extras and version', () => {
    expect(normalize('pypi', 'requests[socks]==2.31')).toBe('requests');
  });

  it('strips extras alone and other version operators', () => {
    expect(normalize('pypi', 'requests[socks]')).toBe('requests');
    expect(normalize('pypi', 'requests>=2.0,<3')).toBe('requests');
  });

  it.each(['Requests', 'REQUESTS'])('lowercases %s', (input) => {
    expect(normalize('pypi', input)).toBe('requests');
  });

  it.each(['re_quests', 're.quests', 'Re--Quests', 're-quests'])(
    'collapses separators in %s',
    (input) => {
      expect(normalize('pypi', input)).toBe('re-quests');
    },
  );
});

describe('normalize: invalid input', () => {
  const invalidNames: unknown[] = ['', '   ', 123, null, undefined, {}, []];

  it.each(invalidNames.map((v) => [v]))('returns "" for name %j', (value) => {
    expect(normalize('npm', value)).toBe('');
    expect(normalize('pypi', value)).toBe('');
  });

  it('returns "" for an unknown ecosystem', () => {
    expect(normalize('cargo' as unknown as Ecosystem, 'serde')).toBe('');
  });

  it('returns only the name, never the version', () => {
    expect(normalize('npm', 'react@18.2.0')).not.toContain('18');
    expect(normalize('pypi', 'requests==2.31')).not.toContain('2.31');
  });
});
