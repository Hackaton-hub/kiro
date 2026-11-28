import fc from 'fast-check';
import { describe, it } from 'vitest';
import { normalize } from '../src/normalize.js';
import type { Ecosystem } from '../src/types.js';

const NUM_RUNS = 100;

const knownEcosystem = fc.constantFrom<Ecosystem>('npm', 'pypi');

// Deliberately bypasses the Ecosystem type to exercise run-time guards.
function callUnsafe(ecosystem: unknown, name: unknown): unknown {
  return normalize(ecosystem as Ecosystem, name);
}

describe('normalize: properties', () => {
  it('is idempotent', () => {
    // Feature: s1-normalize, Property 1: Idempotence
    // **Validates: Requirements 5.1**
    fc.assert(
      fc.property(knownEcosystem, fc.string(), (e, x) => {
        const once = normalize(e, x);
        return normalize(e, once) === once;
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('never throws and always returns a string', () => {
    // Feature: s1-normalize, Property 3: Totality and no throw
    // **Validates: Requirements 3.4, 3.6, 5.3**
    const ecosystemArb = fc.oneof(knownEcosystem, fc.anything());
    fc.assert(
      fc.property(ecosystemArb, fc.anything(), (e, name) => {
        const result = callUnsafe(e, name);
        return typeof result === 'string';
      }),
      { numRuns: NUM_RUNS },
    );
  });

  describe('invalid input returns an empty string', () => {
    // Feature: s1-normalize, Property 6: Invalid input returns empty string
    // **Validates: Requirements 3.3, 3.4, 3.5**
    const whitespaceOnly = fc
      .array(fc.constantFrom(' ', '\t', '\n', '\r', '\u00a0'), { maxLength: 10 })
      .map((chars) => chars.join(''));

    it('for empty and whitespace-only names', () => {
      fc.assert(
        fc.property(knownEcosystem, whitespaceOnly, (e, name) => normalize(e, name) === ''),
        { numRuns: NUM_RUNS },
      );
    });

    it('for non-string names', () => {
      const nonString = fc.anything().filter((v) => typeof v !== 'string');
      fc.assert(
        fc.property(knownEcosystem, nonString, (e, name) => callUnsafe(e, name) === ''),
        { numRuns: NUM_RUNS },
      );
    });

    it('for unknown ecosystems', () => {
      const unknownEcosystem = fc.anything().filter((v) => v !== 'npm' && v !== 'pypi');
      fc.assert(
        fc.property(unknownEcosystem, fc.string(), (e, name) => callUnsafe(e, name) === ''),
        { numRuns: NUM_RUNS },
      );
    });
  });
});

const alphanumericWord = fc.stringMatching(/^[a-z0-9]{1,20}$/);

const separatorRun = fc
  .tuple(fc.constantFrom('-', '_', '.'), fc.integer({ min: 1, max: 3 }))
  .map(([sep, n]) => sep.repeat(n));

// Random upper/lower casing, driven by a generated mask that cycles over the string.
const caseMask = fc.array(fc.boolean(), { minLength: 1, maxLength: 8 });

function applyCase(s: string, mask: boolean[]): string {
  return [...s].map((ch, i) => (mask[i % mask.length] ? ch.toUpperCase() : ch)).join('');
}

const spaces = fc
  .array(fc.constantFrom(' ', '\t', '\n'), { maxLength: 3 })
  .map((chars) => chars.join(''));

describe('normalize: PyPI equivalence and shape', () => {
  it('maps case and separator variants to the same name', () => {
    // Feature: s1-normalize, Property 2: PyPI case and separator equivalence
    // **Validates: Requirements 2.2, 2.3, 5.2**
    fc.assert(
      fc.property(
        fc.array(alphanumericWord, { minLength: 1, maxLength: 4 }),
        fc.array(separatorRun, { minLength: 3, maxLength: 3 }),
        fc.array(separatorRun, { minLength: 3, maxLength: 3 }),
        caseMask,
        caseMask,
        (words, seqA, seqB, maskA, maskB) => {
          const join = (seps: string[]) =>
            words.reduce((acc, w, i) => (i === 0 ? w : acc + seps[i - 1] + w), '');
          const variantA = applyCase(join(seqA), maskA);
          const variantB = applyCase(join(seqB), maskB);
          const expected = words.join('-');
          return normalize('pypi', variantA) === expected && normalize('pypi', variantB) === expected;
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('returns lowercase names with no padding, underscores, dots or double dashes', () => {
    // Feature: s1-normalize, Property 8: PyPI output shape
    // **Validates: Requirements 2.1, 2.2, 2.3**
    const rawName = fc
      .tuple(
        spaces,
        fc.array(fc.tuple(alphanumericWord, separatorRun), { minLength: 1, maxLength: 4 }),
        alphanumericWord,
        caseMask,
        spaces,
      )
      .map(([lead, pairs, last, mask, trail]) => {
        const body = pairs.map(([w, s]) => w + s).join('') + last;
        return lead + applyCase(body, mask) + trail;
      });
    fc.assert(
      fc.property(rawName, (raw) => {
        const out = normalize('pypi', raw);
        return (
          out !== '' &&
          out === out.toLowerCase() &&
          out === out.trim() &&
          !/[_.]/.test(out) &&
          !out.includes('--')
        );
      }),
      { numRuns: NUM_RUNS },
    );
  });
});

describe('normalize: npm shape', () => {
  it('lowercases, trims, keeps the scope and preserves - _ .', () => {
    // Feature: s1-normalize, Property 7: npm output shape
    // **Validates: Requirements 1.1, 1.2, 1.3, 1.6**
    const segment = fc
      .array(fc.tuple(alphanumericWord, separatorRun), { minLength: 0, maxLength: 3 })
      .chain((pairs) =>
        alphanumericWord.map((last) => pairs.map(([w, s]) => w + s).join('') + last),
      );
    const rawName = fc
      .tuple(spaces, fc.option(segment, { nil: undefined }), segment, caseMask, spaces)
      .map(([lead, scope, name, mask, trail]) => {
        const body = (scope === undefined ? '' : `@${scope}/`) + name;
        return { raw: lead + applyCase(body, mask) + trail, body: body.toLowerCase(), scoped: scope !== undefined };
      });
    fc.assert(
      fc.property(rawName, ({ raw, body, scoped }) => {
        const out = normalize('npm', raw);
        return (
          out === body &&
          out === out.toLowerCase() &&
          out === out.trim() &&
          out.startsWith('@') === scoped
        );
      }),
      { numRuns: NUM_RUNS },
    );
  });
});

// Names built from words and separators, reused by the suffix properties.
const nameSegment = fc
  .array(fc.tuple(alphanumericWord, separatorRun), { minLength: 0, maxLength: 3 })
  .chain((pairs) => alphanumericWord.map((last) => pairs.map(([w, s]) => w + s).join('') + last));

const npmBaseName = fc
  .tuple(fc.option(nameSegment, { nil: undefined }), nameSegment, caseMask)
  .map(([scope, name, mask]) =>
    applyCase((scope === undefined ? '' : `@${scope}/`) + name, mask),
  );

const pypiBaseName = fc
  .tuple(fc.array(fc.tuple(alphanumericWord, separatorRun), { maxLength: 3 }), alphanumericWord, caseMask)
  .map(([pairs, last, mask]) => applyCase(pairs.map(([w, s]) => w + s).join('') + last, mask));

const semver = fc
  .tuple(fc.nat(99), fc.nat(99), fc.nat(99))
  .map(([a, b, c]) => `${a}.${b}.${c}`);

const npmVersionSuffix = semver.map((v) => `@${v}`);

const pypiOperator = fc.constantFrom('==', '>=', '<=', '~=', '!=', '>', '<');
const pypiVersionSuffix = fc.tuple(pypiOperator, semver).map(([op, v]) => op + v);

const extrasSuffix = fc
  .array(alphanumericWord, { minLength: 1, maxLength: 3 })
  .map((extras) => `[${extras.join(',')}]`);

describe('normalize: suffix invariance', () => {
  it('ignores a version suffix', () => {
    // Feature: s1-normalize, Property 4: Version-suffix invariance
    // **Validates: Requirements 1.4, 1.5, 2.5, 5.4**
    fc.assert(
      fc.property(npmBaseName, npmVersionSuffix, (n, v) => normalize('npm', n + v) === normalize('npm', n)),
      { numRuns: NUM_RUNS },
    );
    fc.assert(
      fc.property(pypiBaseName, pypiVersionSuffix, (n, v) => normalize('pypi', n + v) === normalize('pypi', n)),
      { numRuns: NUM_RUNS },
    );
  });

  it('ignores PyPI extras, with or without a version after them', () => {
    // Feature: s1-normalize, Property 5: PyPI extras invariance
    // **Validates: Requirements 2.4**
    fc.assert(
      fc.property(
        pypiBaseName,
        extrasSuffix,
        fc.option(pypiVersionSuffix, { nil: '' }),
        (n, extras, v) => normalize('pypi', n + extras + v) === normalize('pypi', n),
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
