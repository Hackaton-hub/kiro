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
