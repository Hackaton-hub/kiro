# Implementation Plan: s8-autopsy-page

## Overview

TypeScript, Vite, no framework, in `apps/web`. Milestone 1 (tasks 1 to 6) ends when the verdict card shows for the three examples and `pnpm lint` and `pnpm test` pass. Milestones 2 to 4 are short sketches, to be detailed later.

## Tasks

### MILESTONE 1: verdict card for 3 examples

- [x] 1. Set up apps/web
  - [x] 1.1 Add dependencies and update the lockfile
    - Add `@phantom/core` as `workspace:*`, plus `vitest`, `fast-check` and `happy-dom` to `apps/web/package.json`
    - Run `pnpm install` and commit the updated `pnpm-lock.yaml` (CI uses `--frozen-lockfile`)
    - _Requirements: 9.1_
  - [x] 1.2 Add `vite-env.d.ts` and fix `index.html`
    - Create `apps/web/src/vite-env.d.ts` with `/// <reference types="vite/client" />`
    - Set `lang="en"` on `<html>` in `apps/web/index.html` and keep the `#app` mount
    - _Requirements: 3.12, 9.1_

- [x] 2. Create the demo verdict files in `demo/verdicts/`
  - All files conform to `Verdict` from `packages/core/src/types.ts`: `contractVersion` `"1.0.0"`, `demo: true`, headline of at most 80 characters, at least one Evidence per signal
  - [x] 2.1 Write `npm__demo-healthy-lib.json`
    - ALLOW / LIVING, with exactly 1 reason, so requirement 1.7 holds unchanged (the Judge returns 0 reasons for ALLOW, which I8 allows, but this fixture keeps 1)
    - _Requirements: 1.1, 1.2, 1.6, 1.7_
  - [x] 2.2 Write `npm__demo-ghost-lib.json`
    - BLOCK / GHOST, one `registry.not_found` signal, suggestion `demo-healthy-lib`, 1 to 3 reasons
    - _Requirements: 1.1, 1.3, 1.6, 1.7_
  - [x] 2.3 Write `npm__demo-possessed-lib.json`
    - BLOCK / POSSESSED, one `eye.install_script` and one `eye.network` signal
    - Each Evidence names file and line, for example `scripts/postinstall.js:3`
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7_

- [x] 3. Implement the demo store
  - [x] 3.1 Implement `apps/web/src/demoStore.ts`
    - `import.meta.glob` with `eager: true`, `isVerdict` guard, `lookup(name)` with key `npm__<name>` as typed
    - Guard: ALLOW accepts 0 to 3 reasons, REVIEW and BLOCK need 1 to 3
    - _Requirements: 2.3, 2.6, 7.3, 7.4, 8.1, 9.1_
  - [x] 3.2 Write unit tests in `apps/web/test/demoStore.test.ts`
    - The 3 fixtures pass `isVerdict` and match the contents in requirements 1.2 to 1.5, 1.7
    - I8: ALLOW with 0 reasons accepted, BLOCK with 0 reasons rejected, 4 reasons rejected, missing field and unknown action rejected
    - `lookup("Demo-Ghost-Lib")` returns `unknown`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.7, 2.3, 7.4_

- [x] 4. Implement the view model
  - [x] 4.1 Implement `apps/web/src/verdictView.ts`
    - Pure `verdictView(v)` with the action and diagnosis mapping tables
    - Copy headline, reasons and suggestion name unchanged, no organ names
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.11, 9.2_
  - [x] 4.2 Write unit tests in `apps/web/test/verdictView.test.ts`
    - Action and diagnosis mapping tables, ghost fixture gives `Did you mean demo-healthy-lib?`
    - _Requirements: 3.1, 3.2, 3.4, 9.2_
  - [x] 4.3 Write property test for non-ALLOW reasons
    - **Property 2: Non-ALLOW verdicts display at least one reason**
    - Tag: `Feature: s8-autopsy-page, Property 2: Non-ALLOW verdicts display at least one reason`, at least 100 runs
    - **Validates: Requirements 1.7, 3.3, 9.2**

- [x] 5. Implement rendering and wiring
  - [x] 5.1 Implement `apps/web/src/render.ts`
    - States `empty`, `loading`, `unknown`, `error`, `verdict`; form, three Example_Buttons, suggestion button, Retry button
    - Use `textContent` only, `role="status"` with `aria-live="polite"`, `role="alert"` for errors
    - No Ectoplasm class outside the `verdict` state
    - _Requirements: 2.1, 2.4, 3.1, 3.2, 3.3, 3.4, 3.10, 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 5.2 Implement `apps/web/src/styles.css`
    - Palette tokens, Night text on every colored fill, system font stacks, no remote URL or `@import`, forced-colors border rule
    - _Requirements: 3.6, 3.9, 3.10, 3.12_
  - [x] 5.3 Implement `apps/web/src/main.ts`
    - Hold state and last name, wire submit, examples, suggestion and Retry through `lookup`, `verdictView` and `render`
    - Catch unexpected exceptions into the `error` state
    - _Requirements: 2.2, 2.3, 3.5, 7.4, 8.1, 9.4_
  - [x] 5.4 Write render and smoke tests
    - `apps/web/test/render.test.ts` starts with `// @vitest-environment happy-dom`
    - `empty`, `loading`, `unknown` and `error` output no "ALLOW", no "LIVING" and no `fill-ectoplasm`; `error` has a Retry button; the card shows action word and icon; clicking the suggestion loads the healthy verdict
    - `styles.css` and `index.html` contain no `http://`, `https://` or `@import`; `index.html` has `lang="en"`
    - _Requirements: 2.2, 3.1, 3.5, 3.10, 3.12, 7.4, 7.5_
  - [x] 5.5 Write property test for demo mode isolation
    - **Property 1: Demo mode never calls fetch**
    - `apps/web/test/demoMode.test.ts` starts with `// @vitest-environment happy-dom`; stub `globalThis.fetch`, submit `fc.string()` and `fc.unicodeString()` values, assert 0 calls
    - Tag: `Feature: s8-autopsy-page, Property 1: Demo mode never calls fetch`, at least 100 runs
    - **Validates: Requirements 8.1, 8.2**

- [x] 6. **END OF MILESTONE 1: checkpoint**
  - **Stop here.** Verify the verdict card shows for the 3 examples (healthy, ghost, possessed) and the ghost suggestion loads the healthy card
  - Ensure `pnpm lint` and `pnpm test` pass, ask the user if questions arise.
  - _Requirements: 11.1_

### MILESTONE 2: seam badges, normalize, fonts (sketch)

- [ ] 7. Milestone 2: add Seam_Badges, import `normalize` from `@phantom/core` for the lookup, self-host Inter, JetBrains Mono and Creepster in `apps/web`.
  - _Requirements: 2.5, 3.7, 3.8, 4.1, 4.2, 9.5, 11.2_

### MILESTONE 3: haunted house and timeline (sketch)

- [ ] 8. Milestone 3: add `house.ts` (SVG from `eye.*` signals), `timeline.ts` (from `clock.*` evidence) and the Text_Chronology.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 11.3_

### MILESTONE 4: online mode (sketch)

- [ ] 9. Milestone 4: add the async online path with `POST /api/check`, valid-Verdict check and error state, keeping the demo path fetch-free.
  - _Requirements: 10.1, 10.2, 10.3, 11.4_

## Notes

- Test sub-tasks in Milestone 1 are required, not optional, by team decision.
- Milestones 2 to 4 are sketches and get a sub-task breakdown when they start.
- Each task references specific requirements for traceability.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1"] },
    { "id": 4, "tasks": ["4.2"] },
    { "id": 5, "tasks": ["4.3"] },
    { "id": 6, "tasks": ["5.1", "5.2"] },
    { "id": 7, "tasks": ["5.3"] },
    { "id": 8, "tasks": ["5.4", "5.5"] },
    { "id": 9, "tasks": ["6"] },
    { "id": 10, "tasks": ["7"] },
    { "id": 11, "tasks": ["8"] },
    { "id": 12, "tasks": ["9"] }
  ]
}
```
