import type { Ecosystem } from './types.js';

function isValidEcosystem(ecosystem: unknown): ecosystem is Ecosystem {
  return ecosystem === 'npm' || ecosystem === 'pypi';
}

// Cuts at the first '@'. Callers pass a segment that no longer holds the
// scope's own '@', so any '@' left here starts a version.
function stripNpmVersion(segment: string): string {
  const at = segment.indexOf('@');
  return at === -1 ? segment : segment.slice(0, at);
}

function normalizeNpm(raw: string): string {
  const lowered = raw.trim().toLowerCase();
  let result: string;
  if (lowered.startsWith('@')) {
    const slash = lowered.indexOf('/');
    if (slash === -1) {
      // Scope without a name: keep the leading '@', drop any later version.
      result = '@' + stripNpmVersion(lowered.slice(1));
    } else {
      result = lowered.slice(0, slash + 1) + stripNpmVersion(lowered.slice(slash + 1));
    }
  } else {
    result = stripNpmVersion(lowered);
  }
  // Trim again: stripping can leave trailing whitespace, which would
  // change the output on a second pass.
  return result.trim();
}

// Names never contain these characters, so the first one marks the start of
// extras (`[`) or of a version specifier (`@`, `==`, `>=`, `<=`, `~=`, `!=`, `>`, `<`).
function stripPypiVersionAndExtras(raw: string): string {
  const cut = raw.search(/[[@=<>~!]/);
  return cut === -1 ? raw : raw.slice(0, cut);
}

function collapseSeparators(s: string): string {
  return s.replace(/[-_.]+/g, '-');
}

function normalizePypi(raw: string): string {
  const stripped = stripPypiVersionAndExtras(raw.trim().toLowerCase());
  return collapseSeparators(stripped.trim());
}

export function normalize(ecosystem: Ecosystem, name: unknown): string {
  try {
    if (typeof name !== 'string' || name.trim() === '') return '';
    if (!isValidEcosystem(ecosystem)) return '';
    return ecosystem === 'npm' ? normalizeNpm(name) : normalizePypi(name);
  } catch {
    return '';
  }
}
