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

## 2026-11-27 · Ange · [steering]
Goal       : Write design-theme.md so Kiro applies our visual identity and
             tone on every surface (hook, CLI, web page), and prove the effect
             with a before / after test.
In Kiro    : Same prompt sent twice in fresh supervised sessions (Auto model):
             "Write a standalone HTML page that shows the verdict card of a
             blocked npm package demo-possessed-lib (BLOCK, POSSESSED, a
             headline, two reasons, a suggestion). Show the code in the chat,
             do not create files."
             PR: [setup] steer: design theme
Result     : BEFORE (no design-theme): generic dark grey/red palette, system
             fonts, verdict shown by word + colour only (no icon), jargon
             badges ("Action : BLOCK", "Diagnostic : POSSESSED"). The UI text
             was in French (lang="fr") although langue.md requires English UI
             text: Kiro applied "answer in French in the chat" to the page
             content. It also invented a suggestion (demo-safe-lib) that does
             not exist on any registry.
             AFTER (design-theme.md loaded): English UI (lang="en"), full
             Halloween palette (Night background, Blood for BLOCK, Pumpkin for
             POSSESSED), Creepster requested for the 40px headline (not
             rendered yet: the font file is not self-hosted), JetBrains Mono for package
             names, Night text on colored badges with a code comment quoting
             that rule, word + icon on the verdict badge, a humorous headline
             with factual reasons, and the "Did you mean / Fix" lines of the
             hook template. No CDN font link, as the charter requires.
             Still wrong: the suggestion (demo-living-lib) is again invented,
             and the reasons (lookalike + young) would give REVIEW, not BLOCK,
             under the Judge rules. Both belong to the Judge, not to design.
Measure    : 0.99 credits in total (0.19 before, 0.80 for writing the
             charter and the after test) · 3 prompts · 2 lines added by hand
             (Night text on colored fills, self-hosted fonts)
Surprise   : While writing the charter, Kiro checked the contrast of every
             palette color against the background on its own, with a small
             Python script, and wrote the ratios into the file. We had only
             asked for "contrast >= 4.5:1". It did not check text on colored
             fills, which fails; we added that rule by hand.
Proof      : docs/preuves/2026-11-27-ange-design-avant.png
             docs/preuves/2026-11-27-ange-design-apres.png
             docs/preuves/2026-11-27-ange-design-contraste.png

## 2026-11-28 · Ange · [spec · PBT]
Goal       : Build milestone 1 of the autopsy page (S8): a verdict card for the
             three demo packages, read from local files, with no network call
             in demo mode.
In Kiro    : Spec mode ("Build a Feature", requirements first), Supervised, Auto
             model. requirements.md, design.md and tasks.md generated, then each
             reviewed and fixed with one targeted prompt (normalize and fonts
             moved to milestone 2, ALLOW may have 0 reasons, vite/client types,
             happy-dom per test file). Tasks run one at a time with
             "Execute only task X.Y, no sub-agent", up to the checkpoint (task 6).
             PR: [S8] feat: autopsy page v1 (verdict card from demo fixtures)
Result     : apps/web shows the summon form, three example buttons and the
             verdict card (word + icon + color, diagnosis tag, headline in the
             verdict color, reasons, "Did you mean" suggestion). All text goes
             through textContent. 65 tests pass, including two property tests:
             Property 1 submits 200 random strings through the real form with
             fetch stubbed and checks fetch is never called (I6); Property 2
             checks that REVIEW and BLOCK always show at least one reason (I8).
             Found in code review, not by the spec or the tests: render() rebuilt
             the whole page, so the input was emptied after each search and the
             live region was recreated. Fixed with one prompt. Also by review:
             a missing "exactly 1 reason" test for healthy, the headline not in
             the verdict color, and pnpm lint skipping apps/*/test.
             Kiro started sub-agents on its own for task 2 (one per demo file);
             one of them reported a typo in vite-env.d.ts that did not exist.
Measure    : 25.21 credits for S8 (requirements 3.92, design + tasks 5.75,
             implementation 15.54; task 2 alone 3.04 with sub-agents) · about
             15 prompts · 0 lines of app code written by hand
Surprise   : While writing the task list, Kiro flagged on its own that its
             requirements contradicted our contract: requirement 1.7 asked for
             1 to 3 reasons in every demo verdict, but the Judge returns no
             reason for ALLOW (I8 only applies to REVIEW and BLOCK). We kept 1
             reason for the healthy demo file and the guard accepts 0.
Proof      : docs/preuves/2026-11-28-ange-s8-kiro-tasks.png
             docs/preuves/2026-11-28-ange-s8-empty.png
             docs/preuves/2026-11-28-ange-s8-healthy.png
             docs/preuves/2026-11-28-ange-s8-ghost.png
             docs/preuves/2026-11-28-ange-s8-possessed.png
