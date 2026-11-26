# Kiro journal — Phantom Imports

One entry per working session. The "Surprise" line is never empty and never invented.

## Template
## YYYY-MM-DD · <Name> · [spec | hook | steering | MCP | PBT | agent | IDE/CLI/Web]
Goal       :
In Kiro    :
Result     :
Measure    :
Surprise   :
Proof      : docs/preuves/<file>.png

---

## 2026-11-25 · Cédric · [IDE · vibe]
Goal       : Create the pnpm TypeScript monorepo skeleton so the three of us can start
             working in parallel: packages/core (types, normalize, judge, one stub
             provider per organ), packages/cli, packages/mcp, apps/web, demo and
             data folders, Vitest + fast-check, root scripts lint / test / demo.
In Kiro    : One vibe prompt in the IDE chat (no spec: this is setup, not
             architecture). The prompt listed the folders, the stub providers
             returning [], the test setup, and told Kiro not to touch .kiro/.
             PR: [setup] chore: monorepo skeleton 
Result     : Worked on the first run, without errors. Kiro showed its plan and
             reasoning step by step while it created the files, like a chat
             conversation, so I could follow what it was doing before
             accepting. `pnpm install && pnpm test` passed; `.kiro/` is not
             ignored by Git.
Measure    : 0.8 credits · 1 attempt · 
Surprise   : The whole skeleton cost only 0.8 credits. I expected scaffolding
             a monorepo with 4 packages and 8 stub providers to cost much more.
             Seeing Kiro's step-by-step reasoning also made the result easy to
             check before accepting it.
Proof      : docs/preuves/2026-11-25-cedric-skeleton-vibe.png
             docs/preuves/2026-11-25-cedric-skeleton-tests.png

## 2026-11-25 · Cédric · [setup]
Goal       : Finish the team setup so Juste can send the launch message:
             CI, project board, tracking documents. I also took over Ange's
             setup tasks (board and docs) to speed up the start.
In Kiro    : CI written by hand . Board and documents
             done directly in GitHub and in the editor.
Result     : GitHub Actions CI runs install, lint and test on every PR.
             Project board ready: 4 columns, one card per spec (S1–S8) with
             its owner, a contract card, labels S1–S8, setup, contract, bug,
             bonus. CONTRIBUTING.md, journal, credits and decisions files added.
Measure    : 0 credit used 
Surprise   : none
Proof      : PR [setup] docs: contributing, journal, credits, decisions 
            docs/preuves/2026-11-25-cedric-board.png

## 2026-11-25 · Juste · [IDE]
Goal       : contract v1.0.0 — providers typed as SignalProvider, minimal judge, registry fixtures
In Kiro    : 5 chat prompts in Kiro IDE (steering check, providers, CLI/MCP stubs, judge, fixtures). `types.ts` was copied by hand from the team contract, no Kiro.
Result     : steering loaded and followed. 8 providers now follow SignalProvider, judge applies rule 1 (registry.not_found -> BLOCK/GHOST, else ALLOW/LIVING), 3 registry fixtures (healthy, ghost, possessed). 15/15 tests pass. Making collect() async broke the CLI and MCP stubs; fixed with one more prompt.
Measure    : ~25 min, 5 prompts, 1 regression caught by tests, ~1.7 credits used (0 -> ~2/4000)
Surprise   : Kiro said on its own that the fixture envelope (status, weeklyDownloads, body) was its choice and not part of the contract, and offered to adapt it.
Proof      : docs/preuves/2026-11-25-juste-steering-loaded.png, docs/preuves/2026-11-25-juste-steering-answer.png, docs/preuves/2026-11-25-juste-judge.png, docs/preuves/2026-11-25-juste-fixtures.png

## 2026-11-26 · Cédric · [steering]
Goal       : Write technique.md and securite.md so Kiro applies the same technical
             and security rules for the three of us, and prove the effect with a
             before / after test.
In Kiro    : Two steering files with `inclusion: always`. Same prompt asked three
             times in fresh supervised sessions: "Write a TypeScript function that
             checks whether an npm package exists and analyses its postinstall
             script. Show the code in the chat, do not create files."
             PR: [setup] steer: technique and securite — [link]
Result     : BEFORE (no team rules): no package execution, but 3 `throw`s, always
             online, its own French types, and a package that does not exist was
             rated "no risk" — the exact opposite of our product.
             AFTER, try 1: never throws, 404 → registry.not_found, no verdict
             ("only the Judge decides"), English, all three install hooks. Still
             local types: Kiro said it had not read types.ts.
             AFTER, try 2 (contract included with #[[file:packages/core/src/types.ts]]
             + rule on organ boundaries): imports the contract types, implements
             collect(ref, ctx), uses ctx.offline / fixturesDir / timeoutMs, puts
             script analysis in eyeProvider with eye.* signal IDs, full Evidence.
             Generated code was not kept (it was a test; the Eye belongs to Ange).
Measure    : 1.14 credits for the 3 answers (0.26 before, 0.88 for the two
             "after" tries) · 60 min · 1 rule rewrite
Surprise   : 1) The steering files did not show in the Kiro panel until we reloaded
             the window (Developer: Reload Window).
             2) A rule that only points to a file is not enough: Kiro did not open
             types.ts until we included it with #[[file:...]]. That single change
             took it from local types to our exact contract.
             3) Even the "after" code had two real bugs we will turn into tests:
             a missing fixture becomes "not_found" (a healthy package would look like
             a ghost in demo mode), and the regex `\.env\b` also matches
             `process.env`, which would wrongly block packages.
Proof      : docs/preuves/2026-11-26-cedric-steering-apres.png
             docs/preuves/2026-11-26-cedric-steering-apres2.png
             docs/preuves/2026-11-26-cedric-steering-apres-v2.png
             docs/preuves/2026-11-26-cedric-steering-avant.png
             docs/preuves/2026-11-26-cedric-steering-avant-2.png
