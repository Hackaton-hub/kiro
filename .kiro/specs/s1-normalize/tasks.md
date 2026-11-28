# Implementation Plan: s1-normalize

## Overview

Implement the single `normalize(ecosystem, name)` function in `packages/core/src/normalize.ts` in TypeScript. It is pure, total and never throws. `Ecosystem` is imported from `./types.ts`, never redefined. Tests use Vitest and fast-check, with no network access.

## Tasks

- [x] 1. Implement `normalize` and its private helpers
  - [x] 1.1 Write `packages/core/src/normalize.ts`
    - Import the `Ecosystem` type from `./types.ts`. Do not redefine it.
    - Export only `normalize(ecosystem: Ecosystem, name: unknown): string`.
    - Add the private helpers: `isValidEcosystem`, `normalizeNpm`, `stripNpmVersion`, `normalizePypi`, `stripPypiVersionAndExtras`, `collapseSeparators`.
    - Return `""` for a non-string, empty or whitespace-only name, and for an unknown ecosystem.
    - Wrap the body in try/catch and return `""` on any error.
    - npm: trim, lowercase, keep `@scope/`, strip the trailing `@version`, leave `-`, `_` and `.` unchanged.
    - PyPI: trim, lowercase, strip extras and version specifiers, collapse each run of `-`, `_` and `.` into a single `-`.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3_

  - [x] 1.2 Confirm the export in `packages/core/src/index.ts`
    - `export * from './normalize.js';` is already present. Keep it and make sure `normalize` resolves through it.
    - _Requirements: 4.3_

- [x] 2. Write unit tests
  - [x] 2.1 Write `packages/core/test/normalize.test.ts` with Vitest
    - npm: `react@18.2.0` → `react`, `@types/node@20` → `@types/node`, and `-`, `_`, `.` are preserved.
    - PyPI: `requests[socks]==2.31` → `requests`, `Requests` and `REQUESTS` → `requests`, `re_quests`, `re.quests`, `Re--Quests` and `re-quests` → `re-quests`.
    - Invalid inputs return `""`: `""`, `"   "`, `123`, `null`, `undefined`, `{}`, `[]` and an unknown ecosystem.
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 2.2, 2.3, 2.4, 2.5, 3.3, 3.4, 3.5, 3.7_

- [x] 3. Write property-based tests
  - [x] 3.1 Write idempotence and totality properties in `packages/core/test/normalize.property.test.ts`
    - **Property 1: Idempotence**
    - **Validates: Requirements 5.1**
    - **Property 3: Totality and no throw**, using `fc.anything()` for name and ecosystem
    - **Validates: Requirements 3.4, 3.6, 5.3**
    - **Property 6: Invalid input returns empty string**
    - **Validates: Requirements 3.3, 3.4, 3.5**

  - [x] 3.2 Write PyPI equivalence and shape properties in the same file
    - **Property 2: PyPI case and separator equivalence**
    - **Validates: Requirements 2.2, 2.3, 5.2**
    - **Property 8: PyPI output shape**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - **Property 7: npm output shape**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.6**

  - [x] 3.3 Write suffix invariance properties in the same file
    - **Property 4: Version-suffix invariance**
    - **Validates: Requirements 1.4, 1.5, 2.5, 5.4**
    - **Property 5: PyPI extras invariance**
    - **Validates: Requirements 2.4**
    - Use `numRuns: 100` or more for every property. Tag each test with a comment naming its property.
    - _Requirements: 5.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Run `pnpm test` and `pnpm lint`. Both must pass.
  - Confirm that no test calls the network.
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- Task 1.2 only verifies an existing export, so it does not change the file unless the export is missing.
- Unit and property tests live in separate files so they can be edited in parallel.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2"] },
    { "id": 4, "tasks": ["3.3"] },
    { "id": 5, "tasks": ["4"] }
  ]
}
```
