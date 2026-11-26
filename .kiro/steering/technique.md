---
inclusion: always
---

# Technical rules

## Stack
- TypeScript in strict mode, Node 20+, pnpm workspaces monorepo.
- Packages: `packages/core` (engine), `packages/cli`, `packages/mcp`, `apps/web` (Vite).
- Tests: Vitest + fast-check. Lint: the root `pnpm lint` script.

## One engine
- All verification logic lives in `packages/core`. The CLI, MCP server, Kiro hook and web page only call `core`; they never reimplement a check.
- Shared types come only from `packages/core/src/types.ts` (the team contract). Never redefine `Verdict`, `Signal`, `PackageRef` or `Evidence` elsewhere.
- Never change `types.ts` outside a PR labelled `contract` approved by the two other members.
- There is a single name normalization function: `normalize(ecosystem, name)` in `core/src/normalize.ts`. Do not write another one.
- The contract is included below. Always import these types; never define local equivalents.
  #[[file:packages/core/src/types.ts]]
- A provider only emits the signal IDs of its own organ. Install-script analysis belongs to the `eye` provider (`eye.*` signals), not to `registry`.

## Context 
- Every provider signature is `collect(ref: PackageRef, ctx: CheckContext): Promise<Signal[]>`. Use `ctx.offline`, `ctx.fixturesDir` and `ctx.timeoutMs`; never hard-code a timeout.

## Signal providerss
- Each organ exports one `SignalProvider` from `core/src/providers/<organ>.ts`.
- A provider only emits the signal IDs assigned to its organ in the contract.
- A provider never throws. On error or timeout it returns `net.unreachable` (registry) or an empty list, never a favourable signal.
- A provider respects `ctx.offline` (no outgoing network call, read `ctx.fixturesDir`) and `ctx.timeoutMs`.
- Every signal has at least one `Evidence` item.
- Only the Judge (`core/src/judge.ts`) turns signals into a verdict.

## Code style
- Pure, small functions; no hidden global state.
- Async/await, no callbacks.
- Code, comments, identifiers, commit messages and UI text in English.
- Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`, `spec:`, `steer:`.

## Tests
- Every provider has unit tests and at least one property-based test (fast-check).
- Tests never call the real network: use fixtures in `demo/fixtures/<organ>/`.
- A task is done only when `pnpm test` and `pnpm lint` pass.