# Kiro journal

One entry per working session. The "Surprise" line is never empty and never invented.

## 2026-11-25 · Juste · [IDE]
Goal       : contract v1.0.0 — providers typed as SignalProvider, minimal judge, registry fixtures
In Kiro    : 5 chat prompts in Kiro IDE (steering check, providers, CLI/MCP stubs, judge, fixtures). `types.ts` was copied by hand from the team contract, no Kiro.
Result     : steering loaded and followed. 8 providers now follow SignalProvider, judge applies rule 1 (registry.not_found -> BLOCK/GHOST, else ALLOW/LIVING), 3 registry fixtures (healthy, ghost, possessed). 15/15 tests pass. Making collect() async broke the CLI and MCP stubs; fixed with one more prompt.
Measure    : ~25 min, 5 prompts, 1 regression caught by tests, ~1.7 credits used (0 -> ~2/4000)
Surprise   : Kiro said on its own that the fixture envelope (status, weeklyDownloads, body) was its choice and not part of the contract, and offered to adapt it.
Proof      : docs/preuves/2026-11-25-juste-steering-loaded.png, docs/preuves/2026-11-25-juste-steering-answer.png, docs/preuves/2026-11-25-juste-judge.png, docs/preuves/2026-11-25-juste-fixtures.png
